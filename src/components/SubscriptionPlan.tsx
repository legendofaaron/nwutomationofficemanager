
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import SubscriptionCard from './subscription/SubscriptionCard';
import { useSubscription } from './subscription/useSubscription';
import { CancelSubscriptionDialog, SubscribeDialog } from './subscription/SubscriptionDialogs';

const SubscriptionPlan = () => {
  const { user } = useAuth();
  const { 
    subscription, 
    isLoading,
    confirmDialog, 
    setConfirmDialog,
    subscribeDialog,
    setSubscribeDialog,
    paymentMethod,
    setPaymentMethod,
    paymentType,
    setPaymentType,
    processPayment,
    cancelSubscription
  } = useSubscription();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Professional Plan</CardTitle>
          <CardDescription>Sign in to manage your subscription</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <SubscriptionCard 
        subscription={subscription}
        onSubscribeClick={() => setSubscribeDialog(true)}
        onCancelClick={() => setConfirmDialog(true)}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelSubscriptionDialog
        open={confirmDialog}
        setOpen={setConfirmDialog}
        isLoading={isLoading}
        onCancel={cancelSubscription}
      />

      {/* Subscribe/Purchase Dialog */}
      <SubscribeDialog
        open={subscribeDialog}
        setOpen={setSubscribeDialog}
        isLoading={isLoading}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        onSubscribe={processPayment}
      />
    </>
  );
};

export default SubscriptionPlan;
