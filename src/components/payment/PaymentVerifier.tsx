
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export const PaymentVerifier = () => {
  const { verifyPayment } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Since all features are free, we simply show a success message
    if (location.search.includes('status=success')) {
      toast({
        title: "Features unlocked",
        description: "You now have access to all features.",
        duration: 3000,
        variant: "success",
      });
    }
  }, [location]);
  
  // This is an invisible component - it doesn't render anything
  return null;
};
