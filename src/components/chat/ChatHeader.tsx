
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
    <div className={`flex items-center justify-between p-2 ${isDark ? 'border-border/30' : 'border-gray-200/50'} border-b rounded-t-xl`}>
      <div className="flex items-center gap-1.5">
        <Bot className="h-4 w-4 text-primary" />
        <h3 className="font-medium text-sm">{assistantName}</h3>
        {companyName && (
          <span className="text-xs text-muted-foreground">for {companyName}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSettingsClick}
          className="h-6 w-6 rounded-full"
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCloseClick}
          className="h-6 w-6 rounded-full"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
