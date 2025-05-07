import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { localAuth, LocalSession, LocalUser } from '@/services/localAuth';

interface AuthContextType {
  session: LocalSession | null;
  user: LocalUser | null;
  isLoading: boolean;
  isDemoMode: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => void;
  setDemoMode: (isDemoMode: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for demo mode
const DEMO_MODE_STORAGE_KEY = 'office_manager_demo_mode';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    // Initialize demo mode from localStorage if it exists
    const savedDemoMode = localStorage.getItem(DEMO_MODE_STORAGE_KEY);
    return savedDemoMode === 'true';
  });
  const { toast } = useToast();

  // Function to refresh user data
  const refreshUser = () => {
    const { data: { session: currentSession } } = localAuth.getSession();
    if (currentSession) {
      setSession(currentSession);
      setUser(currentSession.user);
    }
  };

  useEffect(() => {
    // Set up the auth state listener first for better security
    const { unsubscribe } = localAuth.onAuthStateChange((event, currentSession) => {
      // Only update session if not in demo mode
      if (!isDemoMode) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
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
    }
    
    setIsLoading(false);

    return () => {
      unsubscribe();
    };
  }, [toast, isDemoMode]);

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
      signOut, 
      refreshUser,
      setDemoMode 
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
