
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Using the PayPal credentials
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID') || 'AbTv2xGDDT32w7XR_Ufdea9NvNefzMb8slQY-VFQ7y9fPtsAZIGxiSQH0_6cfDWbEBUoQg8SLu57xXOg';
const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY') || 'EKDbVbU-JGYnK1MCpZ-jVtSAXSyhLrSiWh55pSuLNzxt36A19_Ua_zGYB5_gDnR_xBtX5fDak-GHcVSH';
const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com'; // Use sandbox for testing

// Supabase client initialization
const supabaseUrl = 'https://nbgxyfrxmorlgdgytlui.supabase.co';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Helper function to log steps for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYPAL-INTEGRATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Parse request body
    const requestData = await req.json();
    const { action, userId, subscriptionId, amount = 500, productName = 'Professional Plan' } = requestData;
    
    logStep("Request parsed", { action, userId, subscriptionId });

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      throw new Error('PayPal credentials not configured');
    }

    // Get PayPal OAuth token
    logStep("Requesting PayPal auth token");
    const tokenResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`)}`,
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      logStep("Failed to get PayPal token", tokenData);
      throw new Error(`Failed to get PayPal token: ${JSON.stringify(tokenData)}`);
    }

    logStep("Received PayPal auth token");
    const accessToken = tokenData.access_token;

    let result;

    switch (action) {
      case 'create_subscription':
        logStep("Creating subscription", { amount, productName });
        
        // Create a PayPal subscription
        const subResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            plan_id: 'P-5ML4271244454362WXNWU5NQ', // This should be your actual PayPal plan ID
            subscriber: {
              name: {
                given_name: 'Office',
                surname: 'Manager'
              },
              email_address: req.headers.get('x-email') || 'customer@example.com'
            },
            application_context: {
              return_url: `${req.headers.get('origin')}/payment?status=success`,
              cancel_url: `${req.headers.get('origin')}/payment?status=cancelled`
            }
          }),
        });

        result = await subResponse.json();
        
        if (!subResponse.ok) {
          logStep("PayPal subscription creation error", result);
          throw new Error(`Failed to create subscription: ${JSON.stringify(result)}`);
        }

        logStep("PayPal subscription created", { id: result.id });

        // Store subscription info in our database
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .update({
            payment_id: result.id,
            status: 'pending', // Set to pending until approved
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            is_subscription: true
          })
          .eq('id', subscriptionId)
          .select();

        if (subError) {
          logStep("Database update error", { error: subError });
          throw new Error(`Failed to update subscription in database: ${subError.message}`);
        }

        // Find the approval URL and return it
        const approvalUrl = result.links.find(link => link.rel === 'approve').href;
        
        logStep("Returning approval URL", { url: approvalUrl });
        
        return new Response(JSON.stringify({
          success: true,
          data: result,
          approvalUrl: approvalUrl
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      case 'create_payment':
        logStep("Creating one-time payment", { amount, productName });
        
        // Create a one-time PayPal payment
        const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: (amount / 100).toFixed(2), // Convert cents to dollars
                },
                description: productName || 'Downloadable Version (Lifetime)',
              },
            ],
            application_context: {
              return_url: `${req.headers.get('origin')}/payment?status=success`,
              cancel_url: `${req.headers.get('origin')}/payment?status=cancelled`,
              user_action: 'PAY_NOW',
            },
          }),
        });

        const orderResult = await orderResponse.json();
        
        if (!orderResponse.ok) {
          logStep("PayPal order creation error", orderResult);
          throw new Error(`Failed to create order: ${JSON.stringify(orderResult)}`);
        }

        logStep("PayPal order created", { id: orderResult.id });

        // Store payment info in our database
        const { data: payData, error: payError } = await supabase
          .from('subscriptions')
          .update({
            payment_id: orderResult.id,
            status: 'pending',
            is_subscription: false
          })
          .eq('id', subscriptionId)
          .select();

        if (payError) {
          logStep("Database update error", { error: payError });
          throw new Error(`Failed to update payment in database: ${payError.message}`);
        }

        // Find the approval URL and return it
        const payApprovalUrl = orderResult.links.find(link => link.rel === 'approve').href;
        
        logStep("Returning approval URL", { url: payApprovalUrl });
        
        return new Response(JSON.stringify({
          success: true,
          data: orderResult,
          approvalUrl: payApprovalUrl
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'cancel_subscription':
        logStep("Cancelling subscription", { subscriptionId });
        
        // First get the PayPal subscription ID from our database
        const { data: cancelData, error: cancelFetchError } = await supabase
          .from('subscriptions')
          .select('payment_id')
          .eq('id', subscriptionId)
          .single();
          
        if (cancelFetchError || !cancelData?.payment_id) {
          logStep("Error fetching subscription", { error: cancelFetchError });
          throw new Error(`Failed to fetch subscription: ${cancelFetchError?.message || 'No payment ID found'}`);
        }
        
        // Cancel a PayPal subscription
        const paypalSubId = cancelData.payment_id;
        const cancelResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${paypalSubId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            reason: 'User requested cancellation',
          }),
        });

        if (!cancelResponse.ok) {
          const errorText = await cancelResponse.text();
          logStep("PayPal cancellation error", { error: errorText });
          // Continue with local cancellation even if PayPal call fails
        } else {
          logStep("PayPal subscription cancelled successfully");
        }

        // Update our database regardless of PayPal response
        const { error: cancelError } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
          })
          .eq('id', subscriptionId);

        if (cancelError) {
          logStep("Database update error", { error: cancelError });
          throw new Error(`Failed to update subscription in database: ${cancelError.message}`);
        }

        logStep("Successfully cancelled subscription in database");
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Subscription cancelled successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'check_subscription':
        logStep("Checking subscription status", { subscriptionId });
        
        // Get the subscription details from our database
        const { data: checkData, error: checkError } = await supabase
          .from('subscriptions')
          .select('payment_id, is_subscription')
          .eq('id', subscriptionId)
          .single();
          
        if (checkError || !checkData?.payment_id) {
          logStep("Error fetching subscription", { error: checkError });
          throw new Error(`Error fetching subscription: ${checkError?.message || 'No payment ID found'}`);
        }
        
        let checkResponse;
        const paymentId = checkData.payment_id;
        
        if (checkData.is_subscription) {
          // Check a subscription status
          logStep("Checking PayPal subscription status", { id: paymentId });
          checkResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${paymentId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
        } else {
          // Check a payment/order status
          logStep("Checking PayPal order status", { id: paymentId });
          checkResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${paymentId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
        }

        const statusResult = await checkResponse.json();
        
        if (!checkResponse.ok) {
          logStep("PayPal status check error", statusResult);
          throw new Error(`Failed to check status: ${JSON.stringify(statusResult)}`);
        }
        
        logStep("Status check complete", { status: statusResult.status });
        
        // Update our database with the current status
        if (statusResult.status) {
          const paypalStatus = statusResult.status.toLowerCase();
          let dbStatus = 'pending';
          
          // Map PayPal status to our database status
          if (['active', 'approved', 'completed'].includes(paypalStatus)) {
            dbStatus = 'active';
          } else if (['cancelled', 'suspended'].includes(paypalStatus)) {
            dbStatus = 'cancelled';
          }
          
          // Update the status in our database
          await supabase
            .from('subscriptions')
            .update({ status: dbStatus })
            .eq('payment_id', paymentId);
            
          logStep("Updated subscription status in database", { status: dbStatus });
        }

        return new Response(JSON.stringify({
          success: true,
          data: statusResult
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'verify_payment_status':
        // New function to verify payment status after redirect
        logStep("Verifying payment status for user", { userId });
        
        const { data: verifyData, error: verifyError } = await supabase
          .from('subscriptions')
          .select('id, payment_id, is_subscription, status')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (verifyError || !verifyData?.payment_id) {
          logStep("Error fetching recent payment", { error: verifyError });
          throw new Error('No recent payment found');
        }

        logStep("Found payment for verification", { id: verifyData.id, paymentId: verifyData.payment_id });
        
        // Fetch current status from PayPal
        let verifyResponse;
        let paypalStatus;
        
        if (verifyData.is_subscription) {
          verifyResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${verifyData.payment_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          
          const subResult = await verifyResponse.json();
          if (!verifyResponse.ok) {
            logStep("PayPal verification error", subResult);
          } else {
            paypalStatus = subResult.status;
          }
        } else {
          verifyResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${verifyData.payment_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          
          const orderResult = await verifyResponse.json();
          if (!verifyResponse.ok) {
            logStep("PayPal verification error", orderResult);
          } else {
            paypalStatus = orderResult.status;
          }
        }
        
        // Update our database if we got a status
        if (paypalStatus) {
          let dbStatus = 'pending';
          
          // Map PayPal status to our database status
          if (['ACTIVE', 'APPROVED', 'COMPLETED'].includes(paypalStatus.toUpperCase())) {
            dbStatus = 'active';
          } else if (['CANCELLED', 'SUSPENDED'].includes(paypalStatus.toUpperCase())) {
            dbStatus = 'cancelled';
          }
          
          // Only update if status changed
          if (dbStatus !== verifyData.status) {
            await supabase
              .from('subscriptions')
              .update({ status: dbStatus })
              .eq('id', verifyData.id);
              
            logStep("Updated payment status", { oldStatus: verifyData.status, newStatus: dbStatus });
          }
          
          return new Response(JSON.stringify({
            success: true,
            status: dbStatus,
            paypalStatus: paypalStatus
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // If we couldn't verify with PayPal, return the current status
        return new Response(JSON.stringify({
          success: true,
          status: verifyData.status,
          message: "Couldn't verify status with PayPal"
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error in PayPal integration function", { error: errorMessage });
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
