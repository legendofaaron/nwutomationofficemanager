
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

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
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  return (
    <div 
      className={`flex ${
        message.type === 'user' 
          ? 'justify-end' 
          : message.type === 'system' 
            ? 'justify-center' 
            : 'justify-start'
      }`}
    >
      <div 
        className={`${
          message.type === 'user' 
            ? 'bg-blue-500 text-white max-w-[80%] p-3 rounded-lg shadow-sm text-sm' 
            : message.type === 'system'
              ? 'bg-[#1E2430] text-gray-300 px-3 py-1 rounded-full text-xs font-medium'
              : 'bg-[#161B22] text-gray-200 max-w-[80%] p-3 rounded-lg shadow-sm text-sm'
        } whitespace-pre-wrap`}
      >
        {message.content}
      </div>
    </div>
  );
};
