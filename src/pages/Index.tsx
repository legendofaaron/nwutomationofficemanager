
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
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
