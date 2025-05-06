
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'superdark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark' | 'superdark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Add script to immediately set the correct theme class to prevent flash of wrong theme
const addThemeInitScript = () => {
  if (typeof document !== 'undefined') {
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        try {
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme === 'dark' || savedTheme === 'superdark') {
            document.documentElement.classList.add(savedTheme);
          } else if (savedTheme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.add('light');
            }
          } else {
            document.documentElement.classList.add('light');
          }
        } catch (e) {
          console.error('Theme initialization error:', e);
          document.documentElement.classList.add('light');
        }
      })();
    `;
    script.async = false;
    document.head.appendChild(script);
  }
};

// Execute immediately
addThemeInitScript();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof localStorage !== 'undefined' ? (localStorage.getItem('theme') as Theme) : 'light') || 'light'
  );
  
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | 'superdark'>(
    () => {
      if (typeof window === 'undefined') return 'light';
      
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme === 'dark') return 'dark';
      if (savedTheme === 'light') return 'light';
      if (savedTheme === 'superdark') return 'superdark';
      
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    let newResolvedTheme: 'light' | 'dark' | 'superdark';
    
    if (theme === 'system') {
      newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      newResolvedTheme = theme as 'light' | 'dark' | 'superdark';
    }
    
    setResolvedTheme(newResolvedTheme);
    
    // Remove the old theme class and apply the new one
    root.classList.remove('light', 'dark', 'superdark');
    root.classList.add(newResolvedTheme);
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for changes in system preference
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(newTheme);
      
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark', 'superdark');
      root.classList.add(newTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
