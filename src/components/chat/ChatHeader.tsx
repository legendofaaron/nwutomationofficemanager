
import React from 'react';
import { Bot, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

interface ChatHeaderProps {
  assistantName: string;
  companyName?: string;
  onSettingsClick: () => void;
  onCloseClick: () => void;
}

export const ChatHeader = ({ 
  assistantName, 
  companyName, 
  onSettingsClick, 
  onCloseClick 
}: ChatHeaderProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/20 bg-[#0D1117] rounded-t-xl">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-base text-white">{assistantName}</h3>
          {companyName && (
            <span className="text-xs text-gray-400">for {companyName}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSettingsClick}
          className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-[#1E2430]"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCloseClick}
          className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-[#1E2430]"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
