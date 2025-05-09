
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import SubscriptionPlanFeatures from './SubscriptionPlanFeatures';

interface Subscription {
  id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'pending';
  payment_provider: string;
  payment_id?: string;
  subscription_plan: string;
  price_amount: number;
  currency: string;
  current_period_end: string | null;
  is_subscription: boolean;
  subscription_type: string;
}

interface SubscriptionCardProps {
  subscription: Subscription | null;
  onSubscribeClick: () => void;
  onCancelClick: () => void;
}

const SubscriptionCard = ({ subscription, onSubscribeClick, onCancelClick }: SubscriptionCardProps) => {
  // Determine if this is a one-time purchase or subscription
  const isOneTimeProduct = subscription && !subscription.is_subscription;
  const isSubscriptionProduct = subscription && subscription.is_subscription;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {subscription?.subscription_type === 'downloadable' ? 'Downloadable Version' : 'Web Version'}
          {subscription?.status === 'active' && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {isOneTimeProduct ? 'Purchased' : 'Active'}
            </Badge>
          )}
          {subscription?.status === 'pending' && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Pending
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isOneTimeProduct 
            ? 'Desktop application with full offline functionality' 
            : 'Access all premium web features'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold">
          {isOneTimeProduct ? (
            <>$25 <span className="text-sm font-normal">one-time</span></>
          ) : (
            <>$5<span className="text-sm font-normal">/month</span></>
          )}
        </div>
        
        <SubscriptionPlanFeatures isOneTimeProduct={!!isOneTimeProduct} />
      </CardContent>
      <CardFooter>
        {subscription?.status === 'active' ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onCancelClick}
            disabled={!subscription.is_subscription} // Only allow cancellation for subscriptions
          >
            {subscription.is_subscription ? 'Cancel Subscription' : 'Download Software'}
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={onSubscribeClick}
          >
            <CreditCard className="mr-2 h-4 w-4" /> Purchase/Subscribe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
