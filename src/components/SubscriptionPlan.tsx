
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, LoaderCircle, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  subscription_type: 'web' | 'downloadable';
}

const formatCurrency = (amount: number, currency: string = 'usd') => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount / 100);
};

const SubscriptionPlan = () => {
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
        // Ensure the data matches the Subscription interface
        const typedSubscription: Subscription = {
          id: data.id,
          status: data.status as 'active' | 'cancelled' | 'expired' | 'trial' | 'pending',
          payment_provider: data.payment_provider,
          payment_id: data.payment_id || undefined,
          subscription_plan: data.subscription_plan,
          price_amount: data.price_amount,
          currency: data.currency || 'usd',
          current_period_end: data.current_period_end,
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

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Professional Plan</CardTitle>
          <CardDescription>Sign in to manage your subscription</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Display content based on subscription type
  const isOneTimeProduct = subscription && !subscription.is_subscription;
  const isSubscriptionProduct = subscription && subscription.is_subscription;

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {subscription?.subscription_type === 'downloadable' ? 'Downloadable Version' : 'Web Version'}
            {subscription?.status === 'active' && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {isOneTimeProduct ? 'Purchased' : 'Active'}
              </Badge>
            )}
            {subscription?.status === 'pending' && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Pending
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isOneTimeProduct 
              ? 'Desktop application with full offline functionality' 
              : 'Access all premium web features'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold">
            {isOneTimeProduct ? (
              '$25 <span className="text-sm font-normal">one-time</span>'
            ) : (
              '$5<span className="text-sm font-normal">/month</span>'
            )}
          </div>
          
          {isOneTimeProduct ? (
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Full offline functionality</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Use your own local LLMs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Lifetime access</span>
              </li>
              <li className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-500" />
                <span>Downloadable desktop application</span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Full access to all web features</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Regular updates and new features</span>
              </li>
            </ul>
          )}
        </CardContent>
        <CardFooter>
          {subscription?.status === 'active' ? (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setConfirmDialog(true)}
              disabled={!subscription.is_subscription} // Only allow cancellation for subscriptions
            >
              {subscription.is_subscription ? 'Cancel Subscription' : 'Download Software'}
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => setSubscribeDialog(true)}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Purchase/Subscribe
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)} disabled={isLoading}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={cancelSubscription} disabled={isLoading}>
              {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subscribe/Purchase Dialog */}
      <Dialog open={subscribeDialog} onOpenChange={setSubscribeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Plan</DialogTitle>
            <DialogDescription>
              Select your preferred payment option
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="subscription" onValueChange={(value) => setPaymentType(value as 'subscription' | 'one-time')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subscription">Web Version ($5/mo)</TabsTrigger>
              <TabsTrigger value="one-time">Downloadable ($25)</TabsTrigger>
            </TabsList>
            <TabsContent value="subscription" className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Monthly subscription for $5/month with full access to all premium web features
              </p>
            </TabsContent>
            <TabsContent value="one-time" className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                One-time payment of $25 for full access to the downloadable desktop version
              </p>
            </TabsContent>
          </Tabs>
          
          <Tabs defaultValue="stripe" onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'paypal')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stripe">Pay with Card</TabsTrigger>
              <TabsTrigger value="paypal">Pay with PayPal</TabsTrigger>
            </TabsList>
            <TabsContent value="stripe" className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                You'll be redirected to our secure payment provider to complete your payment.
              </p>
            </TabsContent>
            <TabsContent value="paypal" className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                You'll be redirected to PayPal to complete your payment.
              </p>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubscribeDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={processPayment} disabled={isLoading}>
              {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {paymentType === 'subscription' 
                ? `Subscribe for $5/month` 
                : `Purchase for $25`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionPlan;
