
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

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col z-20">
      <div className="flex items-center gap-2 p-3 border-b">
        <MessageCircle className="w-5 h-5 text-app-blue" />
        <h3 className="font-medium">Office Assistant</h3>
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
