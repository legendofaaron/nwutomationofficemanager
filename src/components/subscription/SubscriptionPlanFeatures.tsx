
import React from 'react';
import { CheckCircle, Download } from 'lucide-react';

interface SubscriptionPlanFeaturesProps {
  isOneTimeProduct: boolean;
}

const SubscriptionPlanFeatures = ({ isOneTimeProduct }: SubscriptionPlanFeaturesProps) => {
  if (isOneTimeProduct) {
    return (
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
    );
  }
  
  return (
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
  );
};

export default SubscriptionPlanFeatures;
