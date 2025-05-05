
import React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { useTheme } from '@/context/ThemeContext';

export const LoadingScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  return (
    <div className={cn(
      "h-screen w-full flex flex-col items-center justify-center",
      isDarkMode ? "bg-black" : "bg-gradient-to-br from-white to-gray-50"
    )}>
      <div className="relative">
        <Logo />
        <div className="mt-8 relative">
          <div className="h-1 w-40 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse" 
                 style={{width: '75%'}}></div>
          </div>
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Loading your workspace...
          </div>
        </div>
      </div>
    </div>
  );
};
