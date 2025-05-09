
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Subscription {
  id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'pending';
  payment_provider: string;
  payment_id?: string;
  subscription_plan: string;
  price_amount: number;
  currency: string;
  current_period_end: string | null;
  is_subscription: boolean;
  subscription_type: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [subscribeDialog, setSubscribeDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [paymentType, setPaymentType] = useState<'subscription' | 'one-time'>('subscription');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (data) {
        // Type assertion to enforce the Subscription interface shape
        const typedSubscription: Subscription = {
          id: data.id,
          status: data.status as 'active' | 'cancelled' | 'expired' | 'trial' | 'pending',
          payment_provider: data.payment_provider,
          payment_id: data.payment_id || undefined,
          subscription_plan: data.subscription_plan,
          price_amount: data.price_amount,
          currency: data.currency || 'usd',
          current_period_end: data.current_period_end,
          // Handle the new columns with default values if they don't exist in the database yet
          is_subscription: data.is_subscription === undefined ? true : data.is_subscription,
          subscription_type: data.subscription_type || 'web'
        };
        setSubscription(typedSubscription);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const processPayment = async () => {
    setIsLoading(true);
    try {
      const isSubscription = paymentType === 'subscription';
      const amount = isSubscription ? 500 : 2500; // $5 for subscription, $25 for one-time
      
      // First create a subscription or purchase record in our database
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user?.id,
          status: 'pending',
          payment_provider: paymentMethod,
          price_amount: amount,
          subscription_type: isSubscription ? 'web' : 'downloadable',
          is_subscription: isSubscription,
          current_period_end: isSubscription 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : null, // Only set end date for subscriptions
        })
        .select()
        .single();

      if (subError) {
        throw new Error(`Failed to create payment record: ${subError.message}`);
      }

      // Call the appropriate payment provider integration
      const functionName = paymentMethod === 'paypal' ? 'paypal-integration' : 'stripe-integration';
      const response = await supabase.functions.invoke(functionName, {
        body: {
          action: isSubscription ? 'create_subscription' : 'create_payment',
          userId: user?.id,
          subscriptionId: subData.id,
          amount: amount,
          productName: isSubscription ? 'Web Version Subscription' : 'Downloadable Version (Lifetime)'
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || `Failed to process ${paymentMethod} payment`);
      }

      // Redirect user to the payment provider's checkout URL
      const redirectUrl = paymentMethod === 'paypal' 
        ? response.data.approvalUrl 
        : response.data.checkoutUrl;
      
      window.location.href = redirectUrl;
      
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'There was a problem processing your payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setSubscribeDialog(false);
    }
  };

  const cancelSubscription = async () => {
    if (!subscription) return;
    
    setIsLoading(true);
    try {
      const functionName = subscription.payment_provider === 'paypal' ? 'paypal-integration' : 'stripe-integration';
      const response = await supabase.functions.invoke(functionName, {
        body: {
          action: 'cancel_subscription',
          subscriptionId: subscription.id,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to cancel subscription');
      }

      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled successfully.',
      });
      
      fetchSubscription();
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Cancellation Error',
        description: error.message || 'There was a problem cancelling your subscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setConfirmDialog(false);
    }
  };

  return {
    subscription,
    isLoading,
    confirmDialog,
    setConfirmDialog,
    subscribeDialog,
    setSubscribeDialog,
    paymentMethod,
    setPaymentMethod,
    paymentType,
    setPaymentType,
    processPayment,
    cancelSubscription,
    fetchSubscription
  };
}
