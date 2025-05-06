
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, LoaderCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Subscription {
  id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  payment_provider: string;
  payment_id?: string;
  subscription_plan: string;
  price_amount: number;
  currency: string;
  current_period_end: string;
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
          status: data.status as 'active' | 'cancelled' | 'expired' | 'trial',
          payment_provider: data.payment_provider,
          payment_id: data.payment_id || undefined,
          subscription_plan: data.subscription_plan,
          price_amount: data.price_amount,
          currency: data.currency,
          current_period_end: data.current_period_end
        };
        setSubscription(typedSubscription);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const createSubscription = async () => {
    setIsLoading(true);
    try {
      // First create a subscription record in our database
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user?.id,
          status: 'trial',
          price_amount: 500,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (subError) {
        throw new Error(`Failed to create subscription record: ${subError.message}`);
      }

      // Then call PayPal to create actual subscription
      const response = await supabase.functions.invoke('paypal-integration', {
        body: {
          action: 'create_subscription',
          userId: user?.id,
          subscriptionId: subData.id,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create PayPal subscription');
      }

      // Redirect user to PayPal approval URL
      window.location.href = response.data.approvalUrl;
      
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      toast({
        title: 'Subscription Error',
        description: error.message || 'There was a problem setting up your subscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setSubscribeDialog(false);
    }
  };

  const cancelSubscription = async () => {
    if (!subscription || !subscription.payment_id) return;
    
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('paypal-integration', {
        body: {
          action: 'cancel_subscription',
          subscriptionId: subscription.payment_id,
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

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Professional Plan
            {subscription?.status === 'active' && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Access all premium features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold">$5<span className="text-sm font-normal">/month</span></div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Full access to all features</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Priority support</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No usage limits</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          {subscription?.status === 'active' ? (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setConfirmDialog(true)}
            >
              Cancel Subscription
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => setSubscribeDialog(true)}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Subscribe with PayPal
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

      {/* Subscribe Confirmation Dialog */}
      <Dialog open={subscribeDialog} onOpenChange={setSubscribeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              You're about to subscribe to the Professional Plan for {formatCurrency(500)} per month using PayPal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubscribeDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={createSubscription} disabled={isLoading}>
              {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Continue to PayPal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionPlan;
