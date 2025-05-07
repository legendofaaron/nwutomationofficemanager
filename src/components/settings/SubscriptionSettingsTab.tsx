
import React, { useState } from 'react';
import SubscriptionPlan from '../SubscriptionPlan';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CheckCircle, CreditCard, Download } from 'lucide-react';

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
          Manage your subscription plan and payment information
        </p>
      </div>
      
      {!hasActiveSubscription && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You are currently using the free plan with limited features.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Basic document management</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Up to 5 team members</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Limited LLM support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle>Premium Options</CardTitle>
              <CardDescription>Unlock all features</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Choose between a monthly subscription or a one-time purchase for lifetime access.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded p-3 text-center">
                  <CreditCard className="mx-auto h-5 w-5 mb-2" />
                  <h4 className="text-sm font-medium">Web Subscription</h4>
                  <p className="text-xs text-muted-foreground mt-1">$5/month</p>
                </div>
                <div className="border rounded p-3 text-center">
                  <Download className="mx-auto h-5 w-5 mb-2" />
                  <h4 className="text-sm font-medium">One-time Purchase</h4>
                  <p className="text-xs text-muted-foreground mt-1">$25 lifetime</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpgrade} className="w-full">
                Upgrade Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      <div className="mt-6">
        <SubscriptionPlan />
      </div>
    </div>
  );
};
