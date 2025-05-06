
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export const PaymentError = () => {
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // This component could receive the error via props or context
  // For now, we'll just expose the setter in case parent components need it
  
  if (!paymentError) return null;

  return (
    <div className="mb-6">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-800 dark:text-red-400">Payment Error</h3>
          <p className="text-sm text-red-700 dark:text-red-300">{paymentError}</p>
        </div>
      </div>
    </div>
  );
};
