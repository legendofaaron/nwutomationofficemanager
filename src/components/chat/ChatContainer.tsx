
import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import { MessageBubble, Message } from './MessageBubble';
import { QuickActions } from './QuickActions';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  isSetupMode?: boolean;
  isLoading?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  onSendMessage, 
  onQuickAction, 
  isSetupMode = false,
  isLoading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-2 bg-[#1B222C] border-b border-[#2D3747]/80">
        <QuickActions onActionClick={onQuickAction} disabled={isSetupMode || isLoading} />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0D1117]">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-center items-center py-2">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};
