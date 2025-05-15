
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { localAuth } from '@/services/localAuth';
import { LoadingScreen } from '@/components/LoadingScreen';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await localAuth.getSession();
        if (data.session) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // This is a fallback rendering while checking auth
  return <LoadingScreen />;
};

export default Index;

