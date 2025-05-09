
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

const PremiumFeatureDialog = ({ open, onClose, featureName = 'feature' }: PremiumFeatureDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleContinue = () => {
    navigate('/payment');
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-amber-500" />
            <DialogTitle>All Features Included!</DialogTitle>
          </div>
          <DialogDescription>
            Office Manager is completely free! You have access to all features including <span className="font-medium text-amber-500">{featureName}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950/20">
            <h3 className="font-medium mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              All features are included for free:
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
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Continue Using App
          </Button>
          <Button 
            className="gap-1 sm:w-auto w-full" 
            onClick={handleContinue}
          >
            <CreditCard className="h-4 w-4" />
            Support Development
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumFeatureDialog;
