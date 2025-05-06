
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, subscriptionId, amount = 500, productName = 'Professional Plan' } = await req.json();

    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not configured');
    }

    let result;

    switch (action) {
      case 'create_subscription':
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
          success_url: `${req.headers.get('origin')}/dashboard?success=true`,
          cancel_url: `${req.headers.get('origin')}/dashboard?success=false`,
        });

        // Store subscription info in our database
        await supabase
          .from('subscriptions')
          .update({
            payment_id: session.id,
            payment_provider: 'stripe',
            status: 'pending',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            is_subscription: true
          })
          .eq('id', subscriptionId);

        return new Response(JSON.stringify({
          success: true,
          data: session,
          checkoutUrl: session.url
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'create_payment':
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
          success_url: `${req.headers.get('origin')}/dashboard?success=true`,
          cancel_url: `${req.headers.get('origin')}/dashboard?success=false`,
        });

        // Store payment info in our database
        await supabase
          .from('subscriptions')
          .update({
            payment_id: paymentSession.id,
            payment_provider: 'stripe',
            status: 'pending',
            is_subscription: false
          })
          .eq('id', subscriptionId);

        return new Response(JSON.stringify({
          success: true,
          data: paymentSession,
          checkoutUrl: paymentSession.url
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'cancel_subscription':
        // Retrieve the subscription ID from our database
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('payment_id, is_subscription')
          .eq('id', subscriptionId)
          .single();

        if (!subData?.payment_id) {
          throw new Error('Subscription not found or no payment ID available');
        }

        // Only attempt to cancel if it's a subscription
        if (subData.is_subscription) {
          // Cancel the subscription in Stripe
          const subscription = await stripe.subscriptions.cancel(subData.payment_id);
        }

        // Update our database
        await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
          })
          .eq('id', subscriptionId);

        return new Response(JSON.stringify({
          success: true,
          message: 'Subscription cancelled successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'check_subscription':
        // Retrieve the subscription from Stripe
        const { data: checkSubData } = await supabase
          .from('subscriptions')
          .select('payment_id, is_subscription')
          .eq('id', subscriptionId)
          .single();

        if (!checkSubData?.payment_id) {
          throw new Error('Subscription not found or no payment ID available');
        }

        let checkResult;
        if (checkSubData.is_subscription) {
          // For subscriptions, check subscription status
          checkResult = await stripe.subscriptions.retrieve(checkSubData.payment_id);
        } else {
          // For one-time payments, check payment status
          checkResult = await stripe.checkout.sessions.retrieve(checkSubData.payment_id);
        }
        
        return new Response(JSON.stringify({
          success: true,
          data: checkResult
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in Stripe integration function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
