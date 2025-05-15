
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { localAuth } from '@/services/localAuth';
import { LoadingScreen } from '@/components/LoadingScreen';

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the session once
        const { data } = await localAuth.getSession();
        
        // Navigate based on session status - but only once
        if (data.session) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate('/login');
      } finally {
        setIsChecking(false);
      }
    };
    
    // Only run the check if we haven't done it yet
    if (isChecking) {
      checkAuth();
    }
  }, [navigate, isChecking]);
  
  // This is a fallback rendering while checking auth
  return <LoadingScreen />;
};

export default Index;
