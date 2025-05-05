
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, MessageBubble } from './MessageBubble';
import { QuickActions } from './QuickActions';
import { ChatInput } from './ChatInput';
import { useTheme } from '@/context/ThemeContext';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onQuickAction: (action: string) => void;
  isSetupMode: boolean;
}

export const ChatContainer = ({ 
  messages, 
  onSendMessage, 
  onQuickAction, 
  isSetupMode 
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <>
      {!isSetupMode && <QuickActions onActionSelect={onQuickAction} />}
      
      <ScrollArea className="flex-1 p-4 bg-[#0D1117]">
        <div className="space-y-2">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <ChatInput onSendMessage={onSendMessage} />
    </>
  );
};
