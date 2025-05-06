
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { localAuth, LocalSession, LocalUser } from '@/services/localAuth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: LocalSession | null;
  user: LocalUser | null;
  isLoading: boolean;
  isDemoMode: boolean;
  hasActiveSubscription: boolean;
  checkSubscription: () => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUser: () => void;
  setDemoMode: (isDemoMode: boolean) => void;
  verifyPayment: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for demo mode
const DEMO_MODE_STORAGE_KEY = 'office_manager_demo_mode';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    // Initialize demo mode from localStorage if it exists
    const savedDemoMode = localStorage.getItem(DEMO_MODE_STORAGE_KEY);
    return savedDemoMode === 'true';
  });
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const { toast } = useToast();

  // Function to check if user has an active subscription
  const checkSubscription = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // First check local database
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (error) {
        console.error('Error checking subscription in database:', error);
        return false;
      }
      
      // If there's no active subscription in the database, check with the payment provider
      if (!data) {
        try {
          // Try Stripe first
          const stripeResponse = await supabase.functions.invoke('stripe-integration', {
            body: {
              action: 'verify_payment_status',
              userId: user.id,
            },
          });
          
          if (!stripeResponse.data?.success) {
            // Try PayPal if Stripe check failed
            const paypalResponse = await supabase.functions.invoke('paypal-integration', {
              body: {
                action: 'verify_payment_status',
                userId: user.id,
              },
            });
            
            if (!paypalResponse.data?.success) {
              console.error('Payment provider verification failed');
              setHasActiveSubscription(false);
              return false;
            }
            
            // Update from PayPal verification response
            const isActive = paypalResponse.data.status === 'active';
            setHasActiveSubscription(isActive);
            return isActive;
          }
          
          // Update from Stripe verification response
          const isActive = stripeResponse.data.status === 'active';
          setHasActiveSubscription(isActive);
          return isActive;
          
        } catch (verifyError) {
          console.error('Error verifying with payment provider:', verifyError);
          setHasActiveSubscription(false);
          return false;
        }
      }
      
      // Use the database result
      const isActive = !!data;
      setHasActiveSubscription(isActive);
      return isActive;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setHasActiveSubscription(false);
      return false;
    }
  }, [user]);

  // Function to verify payment status
  const verifyPayment = useCallback(async (): Promise<void> => {
    if (!user || isVerifyingPayment) return;
    
    setIsVerifyingPayment(true);
    try {
      // Try Stripe verification
      const stripeResponse = await supabase.functions.invoke('stripe-integration', {
        body: {
          action: 'verify_payment_status',
          userId: user.id,
        },
      });
      
      if (stripeResponse.data?.status === 'active') {
        setHasActiveSubscription(true);
        return;
      }
      
      // Try PayPal verification
      const paypalResponse = await supabase.functions.invoke('paypal-integration', {
        body: {
          action: 'verify_payment_status',
          userId: user.id,
        },
      });
      
      if (paypalResponse.data?.status === 'active') {
        setHasActiveSubscription(true);
      }
    } catch (error) {
      console.error('Error verifying payment status:', error);
    } finally {
      setIsVerifyingPayment(false);
    }
  }, [user, isVerifyingPayment]);

  // Function to refresh user data
  const refreshUser = useCallback(() => {
    const { data: { session: currentSession } } = localAuth.getSession();
    if (currentSession) {
      setSession(currentSession);
      setUser(currentSession.user);
      
      // Check subscription status when user is refreshed
      checkSubscription();
    }
  }, [checkSubscription]);

  useEffect(() => {
    // Set up the auth state listener first for better security
    const { unsubscribe } = localAuth.onAuthStateChange((event, currentSession) => {
      // Only update session if not in demo mode
      if (!isDemoMode) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check subscription if user is signed in
        if (currentSession?.user) {
          checkSubscription();
          // Also verify payment status to catch any recent payments
          verifyPayment();
        }
      }
      setIsLoading(false);
      
      // Show toast notifications for auth events
      if (event === 'SIGNED_IN') {
        setTimeout(() => {
          toast({
            title: "Signed in successfully",
            description: `Welcome${currentSession?.user?.user_metadata?.username ? ', ' + currentSession.user.user_metadata.username : ''}!`,
          });
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setTimeout(() => {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
        }, 0);
      }
    });

    // Then fetch the initial session
    const { data: { session: initialSession } } = localAuth.getSession();
    
    // Only set the session if not in demo mode
    if (!isDemoMode) {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      // Check subscription if user is signed in
      if (initialSession?.user) {
        checkSubscription();
        // Also verify payment status to catch any recent payments
        verifyPayment();
      }
    }
    
    setIsLoading(false);

    return () => {
      unsubscribe();
    };
  }, [toast, isDemoMode, checkSubscription, verifyPayment]);

  const signOut = async () => {
    try {
      // Reset demo mode
      setDemoMode(false);
      await localAuth.signOut();
      
      // Force refresh to ensure clean state
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Set demo mode function with localStorage persistence
  const setDemoMode = (value: boolean) => {
    // Store demo mode in localStorage for persistence
    localStorage.setItem(DEMO_MODE_STORAGE_KEY, value.toString());
    setIsDemoMode(value);
    
    // If turning on demo mode, make sure we clear any real session
    if (value && session) {
      // We don't need to sign out, just clear the local state
      // This avoids the sign out notification
      setSession(null);
      setUser(null);
    }
  };

  // Provide the authentication context to the app
  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoading, 
      isDemoMode,
      hasActiveSubscription,
      checkSubscription,
      signOut, 
      refreshUser,
      setDemoMode,
      verifyPayment
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
