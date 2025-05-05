
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { localAuth } from '@/services/localAuth';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await localAuth.getSession();
      if (data.session) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // This is a fallback rendering while checking auth
  return <div className="flex items-center justify-center h-screen">Checking authentication...</div>;
};

export default Index;
