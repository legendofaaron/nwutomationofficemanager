
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

interface SetupWizardProps {
  messages: Message[];
  onSendResponse: (response: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const SetupWizard = ({ messages, onSendResponse, messagesEndRef }: SetupWizardProps) => {
  return (
    <>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2.5">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <ChatInput 
        onSendMessage={onSendResponse}
        placeholder="Type response..." 
      />
    </>
  );
};
