
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
  // Stop propagation of click events
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  if (message.type === 'system') {
    return (
      <div className="flex justify-center mb-3" onClick={handleClick}>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400">
          {message.content}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3 group`}
      onClick={handleClick}
    >
      {message.type === 'ai' && (
        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mr-2 shrink-0">
          <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
      
      <div 
        className={`${
          message.type === 'user' 
            ? 'bg-blue-600 text-white rounded-xl rounded-br-sm' 
            : 'bg-gray-800 text-white rounded-xl rounded-bl-sm'
        } px-4 py-3 max-w-[80%] text-sm`}
      >
        {message.content}
      </div>
      
      {message.type === 'user' && (
        <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center ml-2 shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};
