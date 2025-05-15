
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { localAuth } from '@/services/localAuth';

/**
 * Hook to validate if a user has an active session
 * Only redirects unauthenticated users, not authenticated ones
 */
export const useSessionValidator = (redirectTo: string = '/login') => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasChecked = useRef(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Prevent multiple checks in the same component lifecycle
    if (hasChecked.current) return;
    
    const checkSession = async () => {
      try {
        const { data } = await localAuth.getSession();
        
        // Only redirect if there's no session (the user is not authenticated)
        if (!data.session) {
          // Save the current location for returning after login
          const returnPath = location.pathname !== redirectTo ? location.pathname : '/dashboard';
          navigate(redirectTo, { state: { returnTo: returnPath } });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // On error, we should also redirect to login
        navigate(redirectTo);
      } finally {
        setIsChecking(false);
        hasChecked.current = true;
      }
    };
    
    checkSession();
    
    // Cleanup function to prevent memory leaks
    return () => {
      setIsChecking(false);
    };
  }, [navigate, redirectTo, location.pathname]);

  return { isChecking };
};
