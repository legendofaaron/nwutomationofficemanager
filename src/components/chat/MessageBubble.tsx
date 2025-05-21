
import React from 'react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, className }) => {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <div className="inline-block py-1 px-3 rounded-full bg-gray-800/60 text-xs font-medium text-gray-300 backdrop-blur-sm border border-gray-700/50">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex",
      message.type === 'user' ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm",
        message.type === 'user' 
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm" 
          : "bg-gray-800/70 border border-gray-700/50 text-gray-100 rounded-bl-sm backdrop-blur-sm"
      )}>
        {message.content}
      </div>
    </div>
  );
};
