
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { localAuth } from '@/services/localAuth';

/**
 * Hook to validate if a user has an active session
 * Only redirects unauthenticated users, not authenticated ones
 */
export const useSessionValidator = (redirectTo: string = '/login') => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await localAuth.getSession();
        // Only redirect if there's no session (the user is not authenticated)
        if (!data.session) {
          navigate(redirectTo);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // On error, we should also redirect to login
        navigate(redirectTo);
      }
    };
    
    checkSession();
  }, [navigate, redirectTo]);
};

