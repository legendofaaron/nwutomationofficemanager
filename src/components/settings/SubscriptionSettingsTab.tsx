
import React from 'react';
import SubscriptionPlan from '../SubscriptionPlan';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const SubscriptionSettingsTab = () => {
  const { hasActiveSubscription } = useAuth();
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    navigate('/payment');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan and billing information
        </p>
        
        {!hasActiveSubscription && (
          <div className="mt-4">
            <Button onClick={handleUpgrade}>
              Upgrade to Professional
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <SubscriptionPlan />
      </div>
    </div>
  );
};
