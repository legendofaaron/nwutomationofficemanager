
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Stripe with the secret key
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Supabase client initialization
const supabaseUrl = 'https://nbgxyfrxmorlgdgytlui.supabase.co';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Helper function to log steps for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-INTEGRATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not configured');
    }

    const requestData = await req.json();
    const { action, userId, subscriptionId, amount = 500, productName = 'Professional Plan' } = requestData;
    
    logStep("Request parsed", { action, userId, subscriptionId });

    let result;

    switch (action) {
      case 'create_subscription':
        logStep("Creating subscription", { amount, productName });
        
        // Create a Stripe checkout session for subscription
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'subscription',
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: productName || 'Web Version Subscription',
                },
                unit_amount: amount, // $5.00
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            user_id: userId,
            subscription_id: subscriptionId,
          },
          success_url: `${req.headers.get('origin')}/payment?status=success`,
          cancel_url: `${req.headers.get('origin')}/payment?status=cancelled`,
        });

        logStep("Stripe checkout session created", { sessionId: session.id });

        // Store subscription info in our database
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({
            payment_id: session.id,
            payment_provider: 'stripe',
            status: 'pending',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            is_subscription: true
          })
          .eq('id', subscriptionId)
          .select();
          
        if (updateError) {
          logStep("Error updating subscription record", { error: updateError });
          throw new Error(`Failed to update subscription record: ${updateError.message}`);
        }

        return new Response(JSON.stringify({
          success: true,
          data: session,
          checkoutUrl: session.url
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'create_payment':
        logStep("Creating one-time payment", { amount, productName });
        
        // Create a Stripe checkout session for one-time payment
        const paymentSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment', // Important - this makes it a one-time payment
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: productName || 'Downloadable Version (Lifetime)',
                },
                unit_amount: amount, // $25.00
              },
              quantity: 1,
            },
          ],
          metadata: {
            user_id: userId,
            subscription_id: subscriptionId,
            is_subscription: false
          },
          success_url: `${req.headers.get('origin')}/payment?status=success`,
          cancel_url: `${req.headers.get('origin')}/payment?status=cancelled`,
        });

        logStep("Stripe payment session created", { sessionId: paymentSession.id });

        // Store payment info in our database
        const { data: payData, error: payError } = await supabase
          .from('subscriptions')
          .update({
            payment_id: paymentSession.id,
            payment_provider: 'stripe',
            status: 'pending',
            is_subscription: false
          })
          .eq('id', subscriptionId)
          .select();
          
        if (payError) {
          logStep("Error updating payment record", { error: payError });
          throw new Error(`Failed to update payment record: ${payError.message}`);
        }

        return new Response(JSON.stringify({
          success: true,
          data: paymentSession,
          checkoutUrl: paymentSession.url
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'cancel_subscription':
        // Retrieve the subscription ID from our database
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('payment_id, is_subscription')
          .eq('id', subscriptionId)
          .single();

        if (subError || !subData?.payment_id) {
          logStep("Error fetching subscription", { error: subError });
          throw new Error('Subscription not found or no payment ID available');
        }

        logStep("Found subscription", { paymentId: subData.payment_id, isSubscription: subData.is_subscription });

        // Only attempt to cancel if it's a subscription
        if (subData.is_subscription) {
          try {
            // Check if this is a Stripe Subscription ID or a Checkout Session ID
            if (subData.payment_id.startsWith('cs_')) {
              // This is a checkout session ID, need to get subscription ID
              const checkoutSession = await stripe.checkout.sessions.retrieve(subData.payment_id);
              if (checkoutSession.subscription) {
                await stripe.subscriptions.cancel(checkoutSession.subscription as string);
                logStep("Cancelled subscription from checkout session", { subscriptionId: checkoutSession.subscription });
              }
            } else if (subData.payment_id.startsWith('sub_')) {
              // This is a subscription ID
              await stripe.subscriptions.cancel(subData.payment_id);
              logStep("Cancelled subscription directly", { subscriptionId: subData.payment_id });
            } else {
              throw new Error(`Unrecognized payment ID format: ${subData.payment_id}`);
            }
          } catch (stripeError: any) {
            logStep("Error cancelling in Stripe", { error: stripeError.message });
            // Continue with local cancellation even if Stripe call fails
          }
        }

        // Update our database regardless of Stripe call success
        const { data: cancelData, error: cancelError } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
          })
          .eq('id', subscriptionId)
          .select();
          
        if (cancelError) {
          logStep("Error updating cancellation status", { error: cancelError });
          throw new Error(`Failed to update subscription status: ${cancelError.message}`);
        }

        logStep("Successfully cancelled subscription in database");
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Subscription cancelled successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'check_subscription':
        // Retrieve the subscription from Stripe
        const { data: checkSubData, error: checkSubError } = await supabase
          .from('subscriptions')
          .select('payment_id, is_subscription')
          .eq('id', subscriptionId)
          .single();

        if (checkSubError || !checkSubData?.payment_id) {
          logStep("Error fetching subscription for check", { error: checkSubError });
          throw new Error('Subscription not found or no payment ID available');
        }

        logStep("Found subscription for status check", { paymentId: checkSubData.payment_id });

        let checkResult;
        try {
          if (checkSubData.is_subscription) {
            // For subscriptions, we need to handle both checkout session IDs and subscription IDs
            if (checkSubData.payment_id.startsWith('cs_')) {
              // This is a checkout session ID
              const session = await stripe.checkout.sessions.retrieve(checkSubData.payment_id);
              if (session.subscription) {
                checkResult = await stripe.subscriptions.retrieve(session.subscription as string);
              } else {
                checkResult = session;
              }
            } else if (checkSubData.payment_id.startsWith('sub_')) {
              // This is already a subscription ID
              checkResult = await stripe.subscriptions.retrieve(checkSubData.payment_id);
            } else {
              throw new Error(`Unrecognized payment ID format: ${checkSubData.payment_id}`);
            }
          } else {
            // For one-time payments, check payment status
            checkResult = await stripe.checkout.sessions.retrieve(checkSubData.payment_id);
          }
          
          logStep("Retrieved status from Stripe", { status: checkResult.status });
        } catch (stripeError: any) {
          logStep("Error checking with Stripe", { error: stripeError.message });
          throw new Error(`Failed to check status with Stripe: ${stripeError.message}`);
        }
        
        return new Response(JSON.stringify({
          success: true,
          data: checkResult
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'verify_payment_status':
        // New function to verify payment status after redirect
        const { data: verifyData, error: verifyError } = await supabase
          .from('subscriptions')
          .select('payment_id, is_subscription, status')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (verifyError || !verifyData?.payment_id) {
          logStep("Error fetching recent subscription", { error: verifyError });
          throw new Error('No recent payment found');
        }

        logStep("Found payment for verification", { paymentId: verifyData.payment_id });

        let verifyResult;
        let paymentStatus = 'pending';
        
        try {
          if (verifyData.is_subscription) {
            if (verifyData.payment_id.startsWith('cs_')) {
              const session = await stripe.checkout.sessions.retrieve(verifyData.payment_id);
              if (session.subscription) {
                verifyResult = await stripe.subscriptions.retrieve(session.subscription as string);
                paymentStatus = verifyResult.status === 'active' ? 'active' : 'pending';
              } else {
                verifyResult = session;
                paymentStatus = session.payment_status === 'paid' ? 'active' : 'pending';
              }
            } else if (verifyData.payment_id.startsWith('sub_')) {
              verifyResult = await stripe.subscriptions.retrieve(verifyData.payment_id);
              paymentStatus = verifyResult.status === 'active' ? 'active' : 'pending';
            }
          } else {
            // For one-time payments
            verifyResult = await stripe.checkout.sessions.retrieve(verifyData.payment_id);
            paymentStatus = verifyResult.payment_status === 'paid' ? 'active' : 'pending';
          }
          
          // Update database if status has changed
          if (paymentStatus !== verifyData.status) {
            await supabase
              .from('subscriptions')
              .update({ status: paymentStatus })
              .eq('payment_id', verifyData.payment_id);
            
            logStep("Updated payment status", { oldStatus: verifyData.status, newStatus: paymentStatus });
          }
        } catch (stripeError: any) {
          logStep("Error verifying with Stripe", { error: stripeError.message });
          throw new Error(`Failed to verify status with Stripe: ${stripeError.message}`);
        }
        
        return new Response(JSON.stringify({
          success: true,
          status: paymentStatus,
          data: verifyResult
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error in Stripe integration function", { error: errorMessage });
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
