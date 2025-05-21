
import React, { useState } from 'react';
import ChatInput from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatViewProps {
  className?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ className }) => {
  const [messages, setMessages] = useState([
    { id: '1', type: 'ai' as const, content: "Hi! I'm GPT-4o Mini. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = { id: Date.now().toString(), type: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setIsLoading(true);
    
    setTimeout(() => {
      const aiResponse = { 
        id: (Date.now() + 1).toString(), 
        type: 'ai' as const, 
        content: "Sure! Please provide the link or details of the video content you would like me to analyze."
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-black"></div>
          </div>
          <h3 className="text-lg font-medium text-white">Chat</h3>
        </div>
      </header>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-400 p-2">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
              <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        placeholder="Message GPT-4o Mini..."
      />
    </div>
  );
};
