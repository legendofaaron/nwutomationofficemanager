
import { v4 as uuidv4 } from 'uuid';

export interface LocalUser {
  id: string;
  email?: string;
  password: string; // In a real app, this should be hashed
  user_metadata: {
    username?: string; // Add username to user_metadata
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    job_title?: string;
    display_preferences?: {
      theme?: string;
      language?: string;
      dashboard_layout?: 'default' | 'compact' | 'expanded';
    };
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

// Helper to update current user
const updateCurrentUser = (updates: Partial<Omit<LocalUser, 'id' | 'created_at'>>): { data: { user: LocalUser | null }; error: Error | null } => {
  try {
    // Get current session
    const sessionJson = localStorage.getItem(LOCAL_SESSION_KEY);
    if (!sessionJson) {
      return {
        data: { user: null },
        error: new Error('No active session found')
      };
    }
    
    const session: LocalSession = JSON.parse(sessionJson);
    const users = getUsers();
    
    // Find and update user
    const userIndex = users.findIndex(u => u.id === session.user.id);
    if (userIndex === -1) {
      return {
        data: { user: null },
        error: new Error('User not found')
      };
    }
    
    // Apply updates
    if (updates.username) {
      // Check if username is already taken by another user
      const existingUserWithUsername = users.find(u => 
        u.username === updates.username && u.id !== session.user.id
      );
      
      if (existingUserWithUsername) {
        return {
          data: { user: null },
          error: new Error('Username already taken')
        };
      }
      
      users[userIndex].username = updates.username;
    }
    
    if (updates.email) {
      // Check if email is already taken by another user
      if (updates.email) {
        const existingUserWithEmail = users.find(u => 
          u.email === updates.email && u.id !== session.user.id
        );
        
        if (existingUserWithEmail) {
          return {
            data: { user: null },
            error: new Error('Email already taken')
          };
        }
      }
      
      users[userIndex].email = updates.email;
    }
    
    if (updates.password) {
      users[userIndex].password = updates.password;
    }
    
    if (updates.user_metadata) {
      users[userIndex].user_metadata = {
        ...users[userIndex].user_metadata,
        ...updates.user_metadata
      };
    }
    
    // Update in storage
    saveUsers(users);
    
    // Update session
    const updatedUser = users[userIndex];
    const updatedSession: LocalSession = {
      ...session,
      user: { ...updatedUser, password: '[REDACTED]' }
    };
    saveSession(updatedSession);
    
    return {
      data: { user: updatedUser },
      error: null
    };
  } catch (error) {
    return {
      data: { user: null },
      error: error instanceof Error ? error : new Error('Failed to update user')
    };
  }
};

// Function to dispatch auth state change events manually
const dispatchAuthEvent = (event: string, session: LocalSession | null) => {
  // Create a custom event that mimics the storage event
  const customEvent = new CustomEvent('auth-state-change', { 
    detail: { event, session } 
  });
  
  // Dispatch the event
  document.dispatchEvent(customEvent);
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
  signUp: ({ email, password, options, username }: { 
    email: string;
    password: string; 
    username?: string;
    options?: { data?: Record<string, any> }
  }): { data: { user: LocalUser | null }; error: Error | null } => {
    try {
      const users = getUsers();
      
      // Check if username is already taken (if provided)
      if (username) {
        const existingUserByUsername = users.find(user => 
          user.user_metadata.username === username);
        if (existingUserByUsername) {
          return {
            data: { user: null },
            error: new Error('Username is already taken')
          };
        }
      }
      
      // Check if email already exists
      const existingUserByEmail = users.find(user => user.email === email);
      if (existingUserByEmail) {
        return {
          data: { user: null },
          error: new Error('Email is already registered')
        };
      }
      
      // Create new user with username in the right place
      const usernameToUse = username || (options?.data?.username as string) || email.split('@')[0];
      
      const newUser: LocalUser = {
        id: uuidv4(),
        email,
        password,
        user_metadata: {
          ...options?.data,
          username: usernameToUse // Ensure username is in user_metadata
        },
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      saveUsers(users);
      
      // Auto sign in after sign up - using email auth instead of username
      const result = localAuth.signInWithPassword({ email, password });
      
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
  
  // Sign in user with username
  signInWithUsername: ({ username, password }: { 
    username: string; 
    password: string 
  }): { data: { session: LocalSession | null }; error: Error | null } => {
    try {
      const users = getUsers();
      
      // Find user by username
      const user = users.find(user => user.username === username && user.password === password);
      
      if (!user) {
        return {
          data: { session: null },
          error: new Error('Invalid username or password')
        };
      }
      
      // Create session (valid for 7 days)
      const session: LocalSession = {
        user: { ...user, password: '[REDACTED]' }, // Don't include password in session
        access_token: uuidv4(),
        expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      };
      
      saveSession(session);
      
      // Manually trigger auth state change
      dispatchAuthEvent('SIGNED_IN', session);
      
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
  
  // Sign in with password (maintaining backwards compatibility)
  signInWithPassword: ({ email, password }: { 
    email: string; 
    password: string 
  }): { data: { session: LocalSession | null }; error: Error | null } => {
    try {
      const users = getUsers();
      
      // Find user by email
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
      
      // Manually trigger auth state change
      dispatchAuthEvent('SIGNED_IN', session);
      
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
  signOut: async (): Promise<{ error: Error | null }> => {
    try {
      const currentSession = localAuth.getSession().data.session;
      saveSession(null);
      
      // Manually trigger auth state change
      dispatchAuthEvent('SIGNED_OUT', null);
      
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to sign out') };
    }
  },
  
  // Update user
  updateUser: (updates: Partial<Omit<LocalUser, 'id' | 'created_at'>>): { data: { user: LocalUser | null }; error: Error | null } => {
    return updateCurrentUser(updates);
  },
  
  // Upload profile picture (simulated)
  uploadAvatar: async (file: File): Promise<{ data: { url: string } | null, error: Error | null }> => {
    try {
      // Create a unique ID for the image
      const imageId = uuidv4();
      
      // Convert file to data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          
          // In a real app, we'd upload to a server here
          // For this demo, we'll use the data URL directly
          resolve({
            data: { url: dataUrl },
            error: null
          });
        };
        
        reader.onerror = () => {
          resolve({
            data: null,
            error: new Error('Failed to process image')
          });
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to upload image')
      };
    }
  },
  
  // Subscribe to auth state changes (mimicking Supabase's onAuthStateChange)
  onAuthStateChange: (callback: (event: string, session: LocalSession | null) => void) => {
    // Use custom event for auth state changes
    const handleAuthStateChange = (e: any) => {
      const { event, session } = e.detail;
      callback(event, session);
    };
    
    document.addEventListener('auth-state-change', handleAuthStateChange);
    
    // Initial call with current session
    const { data } = localAuth.getSession();
    const eventName = data.session ? 'SIGNED_IN' : 'SIGNED_OUT';
    setTimeout(() => callback(eventName, data.session), 0);
    
    // Return object with unsubscribe method
    return {
      unsubscribe: () => {
        document.removeEventListener('auth-state-change', handleAuthStateChange);
      }
    };
  }
};
