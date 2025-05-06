
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
      isDarkMode ? "bg-gradient-to-br from-[#0d1117] to-[#1a222e]" : 
      isSuperDarkMode ? "bg-gradient-to-br from-black to-[#070707]" : 
      "bg-gradient-to-br from-white to-blue-50"
    )}>
      <div className="relative">
        <div className={cn(
          "animate-spin-slow rounded-full p-2",
          isDarkMode ? "bg-[#0d1117] shadow-md" : 
          isSuperDarkMode ? "bg-black shadow-superdark-md" : 
          "bg-white shadow-elegant-sm"
        )}>
          <Logo className="w-24 h-24" />
        </div>
        <div className="mt-12 relative">
          <div className={cn(
            "h-1.5 w-48 rounded-full overflow-hidden",
            isDarkMode ? "bg-gray-800" : 
            isSuperDarkMode ? "bg-gray-900" : 
            "bg-gray-200"
          )}>
            <div className={cn(
              "h-full rounded-full animate-pulse",
              isDarkMode ? "bg-blue-500" : 
              isSuperDarkMode ? "bg-blue-600" : 
              "bg-blue-500"
            )} style={{width: '75%'}}></div>
          </div>
          <div className={cn(
            "mt-4 text-sm animate-pulse text-center font-medium", 
            isDarkMode ? "text-gray-300" : 
            isSuperDarkMode ? "text-gray-400" : 
            "text-gray-600"
          )}>
            <span className="animate-fade-in inline-block">Loading your workspace...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
