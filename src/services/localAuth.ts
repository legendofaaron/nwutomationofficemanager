
import { v4 as uuidv4 } from 'uuid';

export interface LocalUser {
  id: string;
  email: string;
  password: string; // In a real app, this should be hashed
  user_metadata: {
    full_name?: string;
    username?: string;
  };
  created_at: string;
}

export interface LocalSession {
  user: LocalUser;
  access_token: string;
  expires_at: number; // timestamp when session expires
}

const LOCAL_USERS_KEY = 'app_local_users';
const LOCAL_SESSION_KEY = 'app_local_session';

// Helper to get all users
const getUsers = (): LocalUser[] => {
  const usersJson = localStorage.getItem(LOCAL_USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to save all users
const saveUsers = (users: LocalUser[]): void => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

// Helper to save current session
const saveSession = (session: LocalSession | null): void => {
  if (session) {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
};

export const localAuth = {
  // Get current session
  getSession: (): { data: { session: LocalSession | null } } => {
    const sessionJson = localStorage.getItem(LOCAL_SESSION_KEY);
    const session = sessionJson ? JSON.parse(sessionJson) : null;
    
    // Check if session is expired
    if (session && session.expires_at < Date.now()) {
      saveSession(null);
      return { data: { session: null } };
    }
    
    return { data: { session } };
  },
  
  // Sign up new user
  signUp: ({ email, password, options }: { 
    email: string; 
    password: string; 
    options?: { data?: Record<string, any> }
  }): { data: { user: LocalUser | null }; error: Error | null } => {
    try {
      const users = getUsers();
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        return {
          data: { user: null },
          error: new Error('User with this email already exists')
        };
      }
      
      // Create new user
      const newUser: LocalUser = {
        id: uuidv4(),
        email,
        password,
        user_metadata: options?.data || {},
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      saveUsers(users);
      
      // Auto sign in after sign up - fixed by calling signInWithPassword correctly
      this.signInWithPassword({ email, password });
      
      return { 
        data: { user: newUser },
        error: null
      };
    } catch (error) {
      return {
        data: { user: null },
        error: error instanceof Error ? error : new Error('Failed to sign up')
      };
    }
  },
  
  // Sign in user
  signInWithPassword: ({ email, password }: { 
    email: string; 
    password: string 
  }): { data: { session: LocalSession | null }; error: Error | null } => {
    try {
      const users = getUsers();
      const user = users.find(user => user.email === email && user.password === password);
      
      if (!user) {
        return {
          data: { session: null },
          error: new Error('Invalid email or password')
        };
      }
      
      // Create session (valid for 7 days)
      const session: LocalSession = {
        user: { ...user, password: '[REDACTED]' }, // Don't include password in session
        access_token: uuidv4(),
        expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      };
      
      saveSession(session);
      
      return {
        data: { session },
        error: null
      };
    } catch (error) {
      return {
        data: { session: null },
        error: error instanceof Error ? error : new Error('Failed to sign in')
      };
    }
  },
  
  // Sign out
  signOut: (): { error: Error | null } => {
    try {
      saveSession(null);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to sign out') };
    }
  },
  
  // Subscribe to auth state changes (mimicking Supabase's onAuthStateChange)
  onAuthStateChange: (callback: (event: string, session: LocalSession | null) => void) => {
    // Simple implementation using storage event
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_SESSION_KEY) {
        const session = event.newValue ? JSON.parse(event.newValue) : null;
        const eventName = session ? 'SIGNED_IN' : 'SIGNED_OUT';
        callback(eventName, session);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Initial call with current session
    const { data } = localAuth.getSession();
    const eventName = data.session ? 'SIGNED_IN' : 'SIGNED_OUT';
    setTimeout(() => callback(eventName, data.session), 0);
    
    // Return object with unsubscribe method
    return {
      unsubscribe: () => {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }
};
