
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';
import { QuickActions } from './QuickActions';
import ChatInput from './ChatInput';
import { ArrowDown, MessageSquare, WifiOff, AlertCircle, Upload, HardDriveDownload } from 'lucide-react';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';

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
  isModelConfigured?: boolean;
  onOpenModelSettings: () => void;
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
  useN8n = false,
  isModelConfigured = false,
  onOpenModelSettings
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollAreaElement, setScrollAreaElement] = useState<HTMLElement | null>(null);
  const { checkAccess, PremiumFeatureGate } = usePremiumFeature();

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

  const handleSendCustomMessage = (message: string) => {
    // For advanced AI features, check premium access
    if (message.toLowerCase().includes('customize') || 
        message.toLowerCase().includes('advanced') || 
        message.toLowerCase().includes('train')) {
      if (!checkAccess('Advanced AI Features')) return;
    }
    
    onSendMessage(message);
  };

  const handleCustomQuickAction = (action: string) => {
    // For advanced actions, check premium access
    if (action.toLowerCase().includes('customize') || 
        action.toLowerCase().includes('advanced') || 
        action.toLowerCase().includes('train')) {
      if (!checkAccess('Advanced AI Features')) return;
    }
    
    onQuickAction(action);
  };

  // If model is not configured, show the LLM setup prompt
  if (!isModelConfigured) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-6">
        <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Language Model Available</h3>
        <p className="text-sm text-muted-foreground mb-4">
          To use the chat functionality, you need to configure a local language model.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button 
            onClick={onOpenModelSettings}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" /> Upload Model
          </Button>
          <Button 
            variant="outline" 
            onClick={onOpenModelSettings}
            className="flex items-center gap-2"
          >
            <HardDriveDownload className="h-4 w-4" /> Download Model
          </Button>
        </div>
      </div>
    );
  }

  // If there are no messages yet but model is configured
  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        {!isSetupMode && (
          <QuickActions 
            onActionClick={handleCustomQuickAction} 
            disabled={isLoading} 
          />
        )}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-2">Local LLM Ready</h3>
            <p className="text-sm text-muted-foreground">
              Send a message to begin
            </p>
          </div>
        </div>
        <ChatInput 
          onSendMessage={handleSendCustomMessage} 
          isLoading={isLoading} 
          disabled={isLoading} 
          placeholder="Send a message to your local LLM..."
        />
        <PremiumFeatureGate />
      </div>
    );
  }

  // If using n8n chat, render a container for the n8n chat widget
  if (useN8n) {
    return (
      <div className="flex flex-col h-full">
        {!isSetupMode && (
          <QuickActions 
            onActionClick={handleCustomQuickAction} 
            disabled={isLoading} 
          />
        )}
        
        <div id="n8n-chat-container" className="flex-1 p-3 overflow-y-auto relative"></div>
        <PremiumFeatureGate />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {!isSetupMode && (
        <QuickActions 
          onActionClick={handleCustomQuickAction} 
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
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="bg-[#0A101B] text-gray-200 max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
                <div className="flex space-x-2 items-center h-6">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
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
        onSendMessage={handleSendCustomMessage} 
        isLoading={isLoading} 
        disabled={isLoading} 
        placeholder="Send a message to your local LLM..."
      />

      <PremiumFeatureGate />
    </div>
  );
};
