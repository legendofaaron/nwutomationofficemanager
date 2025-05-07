
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PremiumFeatureDialog from '@/components/PremiumFeatureDialog';

// Define types for premium features
export type PremiumFeature = 
  | 'AI Training'
  | 'Advanced AI Features'
  | 'Document Generation'
  | 'N8N Integration'
  | 'AI Settings'
  | 'Local Model Upload'
  | 'Knowledge Base'
  | 'Spreadsheet Conversion'
  | 'AI Suggestions'
  | 'OpenAI Integration'
  | 'Local Models'
  | 'Model Downloads'
  | 'Custom Model Upload'
  | 'Custom Models'
  | 'AI Assistant Setup';

export function usePremiumFeature() {
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string>('');
  
  // Always grant access to all features
  const checkAccess = (featureName: PremiumFeature) => {
    console.log(`Access granted to feature: ${featureName}`);
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
    hasAccess: true // Always return true for feature access
  };
}
