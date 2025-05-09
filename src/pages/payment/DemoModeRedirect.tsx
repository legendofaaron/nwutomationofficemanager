
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const DemoModeRedirect = () => {
  const { isDemoMode } = useAuth();
  const navigate = useNavigate();
  
  // Skip this page and go directly to dashboard if in demo mode
  useEffect(() => {
    if (isDemoMode) {
      navigate('/dashboard');
    }
  }, [isDemoMode, navigate]);

  return null; // This component doesn't render anything
};
