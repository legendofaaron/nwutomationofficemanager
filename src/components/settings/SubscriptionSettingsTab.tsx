
import React from 'react';
import SubscriptionPlan from '../SubscriptionPlan';

export const SubscriptionSettingsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan and billing information
        </p>
      </div>
      
      <div className="mt-6">
        <SubscriptionPlan />
      </div>
    </div>
  );
};
