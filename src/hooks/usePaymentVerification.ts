
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function usePaymentVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Verify payment status after redirect
  const verifyPaymentStatus = async () => {
    if (!user) return null;
    
    setIsVerifying(true);
    
    try {
      // First try with Stripe
      let response = await supabase.functions.invoke('stripe-integration', {
        body: {
          action: 'verify_payment_status',
          userId: user.id,
        },
      });
      
      // If no stripe payment was found, try PayPal
      if (!response.data?.status) {
        response = await supabase.functions.invoke('paypal-integration', {
          body: {
            action: 'verify_payment_status',
            userId: user.id,
          },
        });
      }
      
      if (response.data?.status === 'active' && !response.error) {
        // Payment was successful
        toast({
          title: "Payment verified",
          description: "Your payment has been verified and your subscription is now active.",
          variant: "default",
        });
        
        setVerificationResult(response.data);
        return response.data;
      } else if (response.data?.status === 'cancelled') {
        // Payment was cancelled
        toast({
          title: "Payment cancelled",
          description: "Your payment has been cancelled.",
          variant: "default",
        });
        
        setVerificationResult(response.data);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error("Error verifying payment status:", error);
      return null;
    } finally {
      setIsVerifying(false);
    }
  };
  
  return {
    isVerifying,
    verificationResult,
    verifyPaymentStatus
  };
}
