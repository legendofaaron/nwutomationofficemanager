import { v4 as uuidv4 } from 'uuid';

export interface LocalUser {
  id: string;
  email: string;
  password: string; // In a real app, this should be hashed
  user_metadata: {
    full_name?: string;
    username?: string;
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
    if (updates.email) {
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
      
      // Auto sign in after sign up - fixed by using the localAuth reference directly
      localAuth.signInWithPassword({ email, password });
      
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
      
      // Find user by email or username
      const user = users.find(user => 
        (user.email === email || user.user_metadata.username === email) && 
        user.password === password
      );
      
      if (!user) {
        return {
          data: { session: null },
          error: new Error('Invalid username/email or password')
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
