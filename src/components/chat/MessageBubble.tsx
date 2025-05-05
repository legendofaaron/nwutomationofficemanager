
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
            ? 'bg-primary text-primary-foreground max-w-[80%] p-2 rounded-lg shadow-sm text-xs' 
            : message.type === 'system'
              ? `${isDark ? 'bg-secondary' : 'bg-gray-200'} ${isDark ? 'text-secondary-foreground' : 'text-gray-800'} px-2.5 py-0.5 rounded-full text-xs font-medium`
              : `${isDark ? 'bg-muted/60' : 'bg-gray-100/90'} ${isDark ? 'text-foreground' : 'text-gray-800'} max-w-[80%] p-2 rounded-lg shadow-sm text-xs`
        } whitespace-pre-wrap`}
      >
        {message.content}
      </div>
    </div>
  );
};
