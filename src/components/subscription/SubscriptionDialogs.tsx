
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CancelDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isLoading: boolean;
  onCancel: () => Promise<void>;
}

export const CancelSubscriptionDialog = ({ open, setOpen, isLoading, onCancel }: CancelDialogProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogDescription>
          Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
          Keep Subscription
        </Button>
        <Button variant="destructive" onClick={onCancel} disabled={isLoading}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Yes, Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

interface SubscribeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isLoading: boolean;
  paymentMethod: 'stripe' | 'paypal';
  setPaymentMethod: (method: 'stripe' | 'paypal') => void;
  paymentType: 'subscription' | 'one-time';
  setPaymentType: (type: 'subscription' | 'one-time') => void;
  onSubscribe: () => Promise<void>;
}

export const SubscribeDialog = ({
  open,
  setOpen,
  isLoading,
  paymentMethod,
  setPaymentMethod,
  paymentType,
  setPaymentType,
  onSubscribe
}: SubscribeDialogProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Choose Your Plan</DialogTitle>
        <DialogDescription>
          Select your preferred payment option
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="subscription" onValueChange={(value) => setPaymentType(value as 'subscription' | 'one-time')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscription">Web Version ($5/mo)</TabsTrigger>
          <TabsTrigger value="one-time">Downloadable ($25)</TabsTrigger>
        </TabsList>
        <TabsContent value="subscription" className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Monthly subscription for $5/month with full access to all premium web features
          </p>
        </TabsContent>
        <TabsContent value="one-time" className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            One-time payment of $25 for full access to the downloadable desktop version
          </p>
        </TabsContent>
      </Tabs>
      
      <Tabs defaultValue="stripe" onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'paypal')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stripe">Pay with Card</TabsTrigger>
          <TabsTrigger value="paypal">Pay with PayPal</TabsTrigger>
        </TabsList>
        <TabsContent value="stripe" className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            You'll be redirected to our secure payment provider to complete your payment.
          </p>
        </TabsContent>
        <TabsContent value="paypal" className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            You'll be redirected to PayPal to complete your payment.
          </p>
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onSubscribe} disabled={isLoading}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {paymentType === 'subscription' 
            ? `Subscribe for $5/month` 
            : `Purchase for $25`}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
