
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, subscriptionId, amount = 500, productName = 'Professional Plan' } = await req.json();

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      throw new Error('PayPal credentials not configured');
    }

    // Get PayPal OAuth token
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
      throw new Error(`Failed to get PayPal token: ${JSON.stringify(tokenData)}`);
    }

    const accessToken = tokenData.access_token;

    let result;

    switch (action) {
      case 'create_subscription':
        // Create a PayPal subscription
        const subResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            plan_id: 'P-12345678901234567', // Replace with your actual PayPal plan ID
            subscriber: {
              name: {
                given_name: 'Office',
                surname: 'Manager'
              },
              email_address: req.headers.get('x-email') || 'customer@example.com'
            },
            application_context: {
              return_url: `${req.headers.get('origin')}/dashboard?success=true`,
              cancel_url: `${req.headers.get('origin')}/dashboard?success=false`
            }
          }),
        });

        result = await subResponse.json();
        
        if (!subResponse.ok) {
          console.error('PayPal subscription creation error:', result);
          throw new Error(`Failed to create subscription: ${JSON.stringify(result)}`);
        }

        // Store subscription info in our database
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .update({
            payment_id: result.id,
            status: 'active',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            is_subscription: true
          })
          .eq('id', subscriptionId)
          .select();

        if (subError) {
          console.error('Database update error:', subError);
          throw new Error(`Failed to update subscription in database: ${subError.message}`);
        }

        // Record the transaction
        const { error: txError } = await supabase
          .from('payment_transactions')
          .insert({
            user_id: userId,
            subscription_id: subscriptionId,
            payment_id: result.id,
            amount: amount, // $5.00
            status: 'completed',
            is_subscription: true
          });

        if (txError) {
          console.error('Transaction record error:', txError);
        }

        return new Response(JSON.stringify({
          success: true,
          data: result,
          approvalUrl: result.links.find(link => link.rel === 'approve').href
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      case 'create_payment':
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
              return_url: `${req.headers.get('origin')}/dashboard?success=true`,
              cancel_url: `${req.headers.get('origin')}/dashboard?success=false`,
            },
          }),
        });

        const orderResult = await orderResponse.json();
        
        if (!orderResponse.ok) {
          console.error('PayPal order creation error:', orderResult);
          throw new Error(`Failed to create order: ${JSON.stringify(orderResult)}`);
        }

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
          console.error('Database update error:', payError);
          throw new Error(`Failed to update payment in database: ${payError.message}`);
        }

        // Record the transaction
        const { error: payTxError } = await supabase
          .from('payment_transactions')
          .insert({
            user_id: userId,
            subscription_id: subscriptionId,
            payment_id: orderResult.id,
            amount: amount,
            status: 'pending',
            is_subscription: false
          });

        if (payTxError) {
          console.error('Transaction record error:', payTxError);
        }

        // Find the approval URL and return it
        const approvalUrl = orderResult.links.find(link => link.rel === 'approve').href;

        return new Response(JSON.stringify({
          success: true,
          data: orderResult,
          approvalUrl: approvalUrl
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'cancel_subscription':
        // Cancel a PayPal subscription
        const cancelResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
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
          const cancelError = await cancelResponse.text();
          console.error('PayPal cancellation error:', cancelError);
          throw new Error(`Failed to cancel subscription: ${cancelError}`);
        }

        // Update our database
        const { error: cancelError } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
          })
          .eq('payment_id', subscriptionId);

        if (cancelError) {
          console.error('Database update error:', cancelError);
          throw new Error(`Failed to update subscription in database: ${cancelError.message}`);
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Subscription cancelled successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'check_subscription':
        // Get the subscription details from our database
        const { data: checkData, error: checkError } = await supabase
          .from('subscriptions')
          .select('payment_id, is_subscription')
          .eq('id', subscriptionId)
          .single();
          
        if (checkError) {
          throw new Error(`Error fetching subscription: ${checkError.message}`);
        }
        
        let checkResponse;
        
        if (checkData.is_subscription) {
          // Check a subscription status
          checkResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${checkData.payment_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
        } else {
          // Check a payment status
          checkResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${checkData.payment_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
        }

        result = await checkResponse.json();
        
        if (!checkResponse.ok) {
          console.error('PayPal status check error:', result);
          throw new Error(`Failed to check status: ${JSON.stringify(result)}`);
        }

        return new Response(JSON.stringify({
          success: true,
          data: result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in PayPal integration function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
