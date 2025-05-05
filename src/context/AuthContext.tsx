
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { localAuth, LocalSession, LocalUser } from '@/services/localAuth';

interface AuthContextType {
  session: LocalSession | null;
  user: LocalUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
      
      // Show toast notifications for auth events
      if (event === 'SIGNED_IN') {
        setTimeout(() => {
          toast({
            title: "Signed in successfully",
            description: `Welcome${currentSession?.user?.user_metadata?.full_name ? ', ' + currentSession.user.user_metadata.full_name : ''}!`,
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

    // Then fetch the initial session - fixed to handle synchronous return
    const { data: { session: initialSession } } = localAuth.getSession();
    setSession(initialSession);
    setUser(initialSession?.user ?? null);
    setIsLoading(false);

    return () => {
      unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    try {
      await localAuth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Provide the authentication context to the app
  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut, refreshUser }}>
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
