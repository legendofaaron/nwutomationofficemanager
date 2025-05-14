
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { localAuth } from '@/services/localAuth';

export const useSessionValidator = (redirectTo: string = '/dashboard') => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await localAuth.getSession();
        if (data.session) {
          navigate(redirectTo);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, [navigate, redirectTo]);
};
