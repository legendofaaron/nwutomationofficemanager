
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';
import { QuickActions } from './QuickActions';
import ChatInput from './ChatInput';
import { ArrowDown } from 'lucide-react';
import { queryLlm, isLlmConfigured } from '@/utils/llm';
import { toast } from '@/hooks/use-toast';

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
  assistantName?: string;
  assistantPurpose?: string;
  companyName?: string;
  useN8n?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  onQuickAction,
  isSetupMode = false,
  isLoading = false,
  assistantName = 'Assistant',
  assistantPurpose = 'help with tasks',
  companyName = '',
  useN8n = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollAreaElement, setScrollAreaElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableElement instanceof HTMLElement) {
        setScrollAreaElement(scrollableElement);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollAreaElement;
        const isScrolledUp = scrollHeight - scrollTop - clientHeight > 50;
        setShowScrollToBottom(isScrolledUp);
      }
    };

    if (scrollAreaElement) {
      scrollAreaElement.addEventListener('scroll', handleScroll);
      return () => {
        scrollAreaElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrollAreaElement]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (message: string) => {
    // Call the parent handler to add the user message to the state
    onSendMessage(message);
  };

  // If using n8n chat, render a container for the n8n chat widget
  if (useN8n) {
    return (
      <div className="flex flex-col h-full">
        {!isSetupMode && (
          <QuickActions 
            onActionClick={onQuickAction} 
            disabled={isLoading} 
          />
        )}
        
        <div id="n8n-chat-container" className="flex-1 p-3 overflow-y-auto relative"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {!isSetupMode && (
        <QuickActions 
          onActionClick={onQuickAction} 
          disabled={isLoading} 
        />
      )}
      
      <ScrollArea className="flex-1 p-3 overflow-y-auto relative" ref={scrollAreaRef}>
        <div className="space-y-4 pb-1">
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
          variant="secondary"
          size="icon"
          className="absolute right-4 bottom-20 rounded-full p-2 h-8 w-8 shadow-md opacity-80 hover:opacity-100 bg-[#1E2430] hover:bg-[#2E3C54] text-white transition-all z-10"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}

      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        disabled={isLoading} 
        placeholder={`Message ${assistantName}...`}
        useN8n={useN8n}
      />
    </div>
  );
};
