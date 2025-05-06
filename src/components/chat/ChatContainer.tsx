
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';
import { QuickActions } from './QuickActions';
import ChatInput from './ChatInput';

interface ChatContainerProps {
  messages: Array<{
    id: string;
    type: 'user' | 'ai' | 'system';
    content: string;
  }>;
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
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full">
      {!isSetupMode && (
        <QuickActions 
          onActionClick={onQuickAction} 
          disabled={isLoading} 
        />
      )}
      
      <ScrollArea className="flex-1 p-3 overflow-y-auto" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {showScrollToBottom && (
        <Button
          variant="outline"
          size="sm"
          className="absolute right-4 bottom-20 rounded-full p-2 h-8 w-8"
          onClick={scrollToBottom}
        >
          <span className="sr-only">Scroll to bottom</span>
          ↓
        </Button>
      )}

      <ChatInput 
        onSendMessage={onSendMessage} 
        isLoading={isLoading} 
        disabled={isLoading} 
      />
    </div>
  );
};
