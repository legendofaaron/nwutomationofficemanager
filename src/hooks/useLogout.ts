
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useLogout = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const confirmLogout = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    }
  }, [signOut, toast, navigate]);

  return {
    showLogoutConfirm,
    setShowLogoutConfirm,
    confirmLogout,
    handleLogout
  };
};
