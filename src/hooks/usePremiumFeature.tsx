
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PremiumFeatureDialog from '@/components/PremiumFeatureDialog';
import { supabase } from '@/integrations/supabase/client';

// Define types for premium features
export type PremiumFeature = 
  | 'AI Training'
  | 'Advanced AI Features'
  | 'Document Generation'
  | 'N8N Integration'
  | 'AI Settings'
  | 'Local Model Upload'
  | 'Knowledge Base';

export function usePremiumFeature() {
  const { user, hasActiveSubscription, checkSubscription } = useAuth();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string>('');
  const [lastVerificationTime, setLastVerificationTime] = useState<number>(0);
  
  // Verify subscription status from server on mount and every 5 minutes
  useEffect(() => {
    const verifySubscriptionStatus = async () => {
      if (user) {
        const now = Date.now();
        // Only check if it's been more than 5 minutes since last check
        if (now - lastVerificationTime > 5 * 60 * 1000) {
          await checkSubscription();
          setLastVerificationTime(now);
        }
      }
    };
    
    verifySubscriptionStatus();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(verifySubscriptionStatus, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user, checkSubscription, lastVerificationTime]);
  
  const checkAccess = (featureName: PremiumFeature) => {
    if (!user) {
      // Not logged in, can't access premium features
      setCurrentFeature(featureName);
      setShowPremiumDialog(true);
      return false;
    }
    
    // Verify subscription status
    if (!hasActiveSubscription) {
      console.log(`Access denied to premium feature: ${featureName}`);
      setCurrentFeature(featureName);
      setShowPremiumDialog(true);
      return false;
    }
    
    console.log(`Access granted to premium feature: ${featureName}`);
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
