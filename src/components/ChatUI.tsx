
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, SendHorizontal } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

const ChatUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your office assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;
    // In a real implementation, this would send the message to your RAG agent
    setInput('');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 shadow-lg hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[400px] h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col z-20 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-2 p-3 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-app-blue" />
          <h3 className="font-medium">Office Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-app-blue text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
