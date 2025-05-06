
import React from 'react';
import { Bot, Settings, X, ChevronDown } from 'lucide-react';
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
  const isSuperDark = resolvedTheme === 'superdark';
  const isDark = resolvedTheme === 'dark' || isSuperDark;
  
  return (
    <div className={`flex items-center justify-between p-3 border-b ${
      isSuperDark 
        ? "border-[#181818] bg-black" 
        : isDark 
          ? "border-[#1E2430]/80 bg-[#0A101B]" 
          : "border-gray-200 bg-white"
      } rounded-t-xl shadow-sm`}>
      <div className="flex items-center gap-2">
        <div className={`h-8 w-8 rounded-full ${
          isSuperDark 
            ? "bg-gradient-to-br from-blue-600 to-blue-800" 
            : "bg-gradient-to-br from-blue-500 to-blue-700"
          } flex items-center justify-center shadow-md`}>
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-800"}`}>{assistantName}</h3>
            <div className="flex items-center h-4 px-1.5 rounded-full bg-green-500/20 text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
              <span className="text-[10px] font-medium">Active</span>
            </div>
          </div>
          {companyName && (
            <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>for {companyName}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSettingsClick}
          className={`h-7 w-7 rounded-full ${
            isDark 
              ? "text-gray-400 hover:text-white hover:bg-[#1E2430]" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }`}
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCloseClick}
          className={`h-7 w-7 rounded-full ${
            isDark 
              ? "text-gray-400 hover:text-white hover:bg-[#1E2430]" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }`}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
