
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { PaymentPlans } from './PaymentPlans';
import { PaymentError } from './PaymentError';
import { DemoModeRedirect } from './DemoModeRedirect';
import { Shield } from 'lucide-react';

const PaymentPage = () => {
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Display payment status message if coming from a payment flow
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    
    if (status === 'success') {
      toast({
        title: "Payment successful",
        description: "Thank you for your purchase. Your account has been upgraded.",
        variant: "default",
      });
      // Remove query parameters after showing toast
      navigate(location.pathname, { replace: true });
    } else if (status === 'cancelled') {
      toast({
        title: "Payment cancelled",
        description: "Your payment was not completed. Please try again if you wish to upgrade.",
        variant: "default",
      });
      // Remove query parameters after showing toast
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);

  return (
    <>
      {/* Redirect to dashboard if in demo mode */}
      <DemoModeRedirect />
      
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#080a0c] dark:to-[#111418]">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <Logo />
            <h1 className="mt-6 text-2xl font-bold">Choose Your Plan</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Select a plan to get started with Office Manager
            </p>
          </div>
          
          <PaymentError />
          <PaymentPlans />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <Shield className="inline h-3 w-3 mr-1" /> 
              Secure payment processing with industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
