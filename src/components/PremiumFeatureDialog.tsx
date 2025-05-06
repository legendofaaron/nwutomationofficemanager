
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, Shield } from 'lucide-react';

interface PremiumFeatureDialogProps {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}

const PremiumFeatureDialog = ({ open, onClose, featureName = 'premium feature' }: PremiumFeatureDialogProps) => {
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    navigate('/payment');
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Premium Feature</DialogTitle>
          <DialogDescription>
            You're trying to access a {featureName}, which is available in our paid plans.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20">
            <h3 className="font-medium mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-amber-600" />
              Choose a plan that fits your needs
            </h3>
            <p className="text-sm text-muted-foreground">
              We offer flexible options for our professional tools, including monthly subscription or one-time purchase.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Continue with Free Plan
          </Button>
          <Button className="gap-1" onClick={handleUpgrade}>
            <CreditCard className="h-4 w-4" />
            View Payment Options
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumFeatureDialog;
