
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { useTheme } from '@/context/ThemeContext';

export const LoadingScreen = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const isSuperDarkMode = resolvedTheme === 'superdark';
  
  // Force a re-render when theme changes to ensure proper display
  useEffect(() => {
    const rootClasses = document.documentElement.classList;
    const updateThemeClass = () => {
      // This is just to trigger a re-render when theme changes
    };
    
    const observer = new MutationObserver(updateThemeClass);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className={cn(
      "h-screen w-full flex flex-col items-center justify-center transition-colors duration-300",
      isDarkMode ? "bg-[#0d1117]" : 
      isSuperDarkMode ? "bg-black" : 
      "bg-gradient-to-br from-white to-gray-50"
    )}>
      <div className="relative">
        <div className="animate-spin-slow">
          <Logo />
        </div>
        <div className="mt-8 relative">
          <div className={cn(
            "h-1 w-40 rounded-full overflow-hidden",
            isDarkMode ? "bg-gray-800" : 
            isSuperDarkMode ? "bg-gray-900" : 
            "bg-gray-200"
          )}>
            <div className={cn(
              "h-full rounded-full animate-pulse",
              isDarkMode || isSuperDarkMode ? "bg-blue-500" : "bg-blue-600"
            )} style={{width: '75%'}}></div>
          </div>
          <div className={cn(
            "mt-3 text-sm animate-pulse text-center", 
            isDarkMode ? "text-gray-400" : 
            isSuperDarkMode ? "text-gray-500" : 
            "text-gray-500"
          )}>
            Loading your workspace...
          </div>
        </div>
      </div>
    </div>
  );
};
