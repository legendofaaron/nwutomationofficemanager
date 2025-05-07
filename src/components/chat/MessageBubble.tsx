
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
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  if (message.type === 'system') {
    return (
      <div className="flex justify-center mb-3">
        <div className="bg-[#1E2430] text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
          {message.content}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3 group`}
    >
      {message.type === 'ai' && (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-2 mt-1 shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div 
        className={`${
          message.type === 'user' 
            ? 'bg-[#4661F1] text-white max-w-[80%] rounded-2xl rounded-br-sm' 
            : 'bg-[#0A101B] text-gray-200 max-w-[80%] rounded-2xl rounded-bl-sm'
        } px-4 py-3 shadow-md text-sm whitespace-pre-wrap`}
      >
        {message.content}
      </div>
      
      {message.type === 'user' && (
        <div className="h-8 w-8 rounded-full bg-[#2E3C54] flex items-center justify-center ml-2 mt-1 shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};
