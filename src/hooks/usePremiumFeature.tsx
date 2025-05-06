
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PremiumFeatureDialog from '@/components/PremiumFeatureDialog';

export function usePremiumFeature() {
  const { hasActiveSubscription } = useAuth();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string>('');
  
  const checkAccess = (featureName: string) => {
    if (!hasActiveSubscription) {
      setCurrentFeature(featureName);
      setShowPremiumDialog(true);
      return false;
    }
    return true;
  };
  
  const PremiumFeatureGate = () => (
    <PremiumFeatureDialog
      open={showPremiumDialog}
      onClose={() => setShowPremiumDialog(false)}
      featureName={currentFeature}
    />
  );
  
  return {
    checkAccess,
    PremiumFeatureGate,
    hasAccess: hasActiveSubscription
  };
}
