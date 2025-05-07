
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
import { CreditCard, Download, Shield, Star, Lock, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PremiumFeatureDialogProps {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}

const PremiumFeatureDialog = ({ open, onClose, featureName = 'premium feature' }: PremiumFeatureDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleUpgrade = () => {
    navigate('/payment');
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-amber-500" />
            <DialogTitle>Premium Feature</DialogTitle>
          </div>
          <DialogDescription>
            You're trying to access <span className="font-medium text-amber-500">{featureName}</span>, which is available in our paid plans.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20">
            <h3 className="font-medium mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-amber-600" />
              Premium benefits include:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 pl-6">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Full access to all AI features and training capabilities</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Knowledge base training and document generation</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Advanced customization and integration options</span>
              </li>
            </ul>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-sm font-medium">Starting at just $5/month</span>
            </div>
            {!user && (
              <span className="text-xs text-muted-foreground">Sign in required</span>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Continue with Free Plan
          </Button>
          <Button 
            className="gap-1 sm:w-auto w-full" 
            onClick={handleUpgrade}
          >
            <CreditCard className="h-4 w-4" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumFeatureDialog;
