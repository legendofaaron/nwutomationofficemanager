
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Bot, User } from 'lucide-react';

export interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  if (message.type === 'system') {
    return (
      <div className="flex justify-center mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isSuperDark 
            ? 'bg-[#181818] text-gray-400' 
            : isDark 
              ? 'bg-[#1E2430] text-gray-300' 
              : 'bg-gray-100 text-gray-600'
        }`}>
          {message.content}
        </div>
      </div>
    );
  }
  
  // Message styles based on theme and message type
  const getUserBubbleStyles = () => {
    if (isSuperDark) return 'bg-[#1E64D0] text-white rounded-2xl rounded-br-sm';
    if (isDark) return 'bg-[#4661F1] text-white rounded-2xl rounded-br-sm';
    return 'bg-blue-500 text-white rounded-2xl rounded-br-sm';
  };
  
  const getAIBubbleStyles = () => {
    if (isSuperDark) return 'bg-[#0A0A0A] text-gray-200 border border-[#181818] rounded-2xl rounded-bl-sm';
    if (isDark) return 'bg-[#0A101B] text-gray-200 rounded-2xl rounded-bl-sm';
    return 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm';
  };
  
  const getUserAvatarStyles = () => {
    if (isSuperDark) return 'bg-[#0F3A7C]';
    if (isDark) return 'bg-[#2E3C54]';
    return 'bg-blue-600';
  };
  
  const getAIAvatarStyles = () => {
    if (isSuperDark) return 'bg-gradient-to-br from-[#181818] to-[#222222]';
    if (isDark) return 'bg-gradient-to-br from-blue-500 to-blue-700';
    return 'bg-gradient-to-br from-blue-400 to-blue-600';
  };
  
  return (
    <div 
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3 group`}
    >
      {message.type === 'ai' && (
        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0 ${getAIAvatarStyles()}`}>
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div 
        className={`${
          message.type === 'user' 
            ? getUserBubbleStyles() 
            : getAIBubbleStyles()
        } px-4 py-3 shadow-sm max-w-[80%] text-sm whitespace-pre-wrap`}
      >
        {message.content}
      </div>
      
      {message.type === 'user' && (
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ml-2 mt-1 shrink-0 ${getUserAvatarStyles()}`}>
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};
