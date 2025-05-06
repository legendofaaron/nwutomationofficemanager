
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export const PaymentVerifier = () => {
  const { verifyPayment } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Check for success parameter in URL
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const status = params.get('status');
    
    // If there's a success or status parameter, verify payment status
    if (success === 'true' || status === 'success') {
      verifyPayment().then(() => {
        toast({
          title: "Payment verification completed",
          description: "Your subscription status has been updated.",
          duration: 3000,
        });
      }).catch(err => {
        console.error("Payment verification error:", err);
        toast({
          title: "Payment verification error",
          description: "Unable to verify your subscription status. Please contact support.",
          variant: "destructive",
          duration: 5000,
        });
      });
    }
  }, [location, verifyPayment]);
  
  // This is an invisible component - it doesn't render anything
  return null;
};
