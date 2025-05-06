
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

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
      verifyPayment();
    }
  }, [location, verifyPayment]);
  
  // This is an invisible component - it doesn't render anything
  return null;
};
