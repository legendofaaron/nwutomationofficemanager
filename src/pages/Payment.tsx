
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, LoaderCircle, ChevronRight, Shield, AlertCircle, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/Logo';

const formatCurrency = (amount: number, currency: string = 'usd') => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount / 100);
};

const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [paymentType, setPaymentType] = useState<'subscription' | 'one-time'>('subscription');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Skip this page and go directly to dashboard if in demo mode
  useEffect(() => {
    if (isDemoMode) {
      navigate('/dashboard');
    }
  }, [isDemoMode, navigate]);
  
  // Skip for existing subscribers
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
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };
    
    checkSubscription();
  }, [user, navigate]);

  const handleContinueWithoutSubscription = () => {
    navigate('/dashboard');
  };

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
    setPaymentError(null);
    
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
      setPaymentError(error.message || 'There was a problem processing your payment');
      
      toast({
        title: 'Payment Error',
        description: error.message || 'There was a problem processing your payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#080a0c] dark:to-[#111418]">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold">Choose Your Plan</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Select a plan to get started with Office Manager
          </p>
        </div>
        
        {paymentError && (
          <div className="mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-400">Payment Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300">{paymentError}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Basic features for personal use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">$0<span className="text-sm font-normal">/month</span></div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Limited LLM support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Basic document management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Up to 5 team members</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleContinueWithoutSubscription}
              >
                Continue with Free Plan <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
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
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Full access to all web features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Advanced document workflows</span>
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
                </CardContent>
              </TabsContent>
              
              <TabsContent value="one-time">
                <CardHeader>
                  <CardTitle>Downloadable Version</CardTitle>
                  <CardDescription>One-time purchase for offline use</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">$25<span className="text-sm font-normal"> one-time</span></div>
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
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <Shield className="inline h-3 w-3 mr-1" /> 
            Secure payment processing with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
