
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, CreditCard, LoaderCircle, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { FreePlan } from './plans/FreePlan';
import SubscriptionPlanFeatures from '@/components/subscription/SubscriptionPlanFeatures';

export const PaymentPlans = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [paymentType, setPaymentType] = useState<'subscription' | 'one-time'>('subscription');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Clear any errors on component mount or when payment method/type changes
  useEffect(() => {
    setError(null);
  }, [paymentMethod, paymentType]);
  
  // Check if user already has an active subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
        
        if (data) {
          // User already has an active subscription, redirect to dashboard
          toast({
            title: "Active subscription found",
            description: "You already have an active subscription.",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };
    
    checkSubscription();
  }, [user, navigate, toast]);

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // First create a subscription or purchase record in our database
      const isSubscription = paymentType === 'subscription';
      const amount = isSubscription ? 500 : 2500; // $5 for subscription, $25 for one-time

      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
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
          userId: user.id,
          subscriptionId: subData.id,
          amount: amount,
          productName: isSubscription ? 'Web Version Subscription' : 'Downloadable Version (Lifetime)'
        },
      });

      if (!response.data?.success) {
        throw new Error(response.error?.message || response.data?.error || `Failed to process ${paymentMethod} payment`);
      }

      // Redirect user to the payment provider's checkout URL
      const redirectUrl = paymentMethod === 'paypal' 
        ? response.data.approvalUrl 
        : response.data.checkoutUrl;
      
      if (!redirectUrl) {
        throw new Error('No redirect URL received from payment provider');
      }
      
      console.log('Redirecting to:', redirectUrl);
      window.location.href = redirectUrl;
      
    } catch (error: any) {
      console.error('Error processing payment:', error);
      
      // Set the error state for the PaymentError component to display
      setError(error.message || 'There was a problem processing your payment');
      
      toast({
        title: 'Payment Error',
        description: error.message || 'There was a problem processing your payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithoutSubscription = () => {
    navigate('/dashboard');
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Free Plan */}
      <FreePlan onContinue={handleContinueWithoutSubscription} />
      
      {/* Display error if there is one */}
      {error && (
        <div className="col-span-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {/* Tabs for different payment plans */}
      <Card className="relative overflow-hidden border-blue-200 dark:border-blue-800 shadow-md">
        <div className="absolute top-0 right-0">
          <Badge variant="default" className="rounded-tl-none rounded-br-none rounded-tr-none">
            Recommended
          </Badge>
        </div>
        
        <Tabs defaultValue="subscription" onValueChange={(value) => setPaymentType(value as 'subscription' | 'one-time')}>
          <TabsList className="grid w-full grid-cols-2 mt-2">
            <TabsTrigger value="subscription">Web Version</TabsTrigger>
            <TabsTrigger value="one-time">Downloadable</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription">
            <CardHeader>
              <CardTitle>Web Version</CardTitle>
              <CardDescription>Monthly subscription with all premium features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">$5<span className="text-sm font-normal">/month</span></div>
              <SubscriptionPlanFeatures isOneTimeProduct={false} />
            </CardContent>
          </TabsContent>
          
          <TabsContent value="one-time">
            <CardHeader>
              <CardTitle>Downloadable Version</CardTitle>
              <CardDescription>One-time purchase for offline use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">$25<span className="text-sm font-normal"> one-time</span></div>
              <SubscriptionPlanFeatures isOneTimeProduct={true} />
            </CardContent>
          </TabsContent>
          
          <div className="px-6 pb-4">
            <Tabs defaultValue="stripe" onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'paypal')} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stripe">Pay with Card</TabsTrigger>
                <TabsTrigger value="paypal">Pay with PayPal</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Tabs>
        
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            <CreditCard className="mr-2 h-4 w-4" /> 
            {paymentType === 'subscription' ? 'Subscribe Now' : 'Purchase Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
