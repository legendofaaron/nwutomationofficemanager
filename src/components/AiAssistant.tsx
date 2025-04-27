
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

const AiAssistant = () => {
  const { aiAssistantOpen, setAiAssistantOpen } = useAppContext();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'ai', content: 'Hi there! I can help you analyze your documents and data. What would you like to know?' }
  ]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    setMessages([...messages, { id: userMessageId, type: 'user', content: input }]);
    
    // Simulate AI response (in a real app, this would call your RAG agent API)
    setTimeout(() => {
      setMessages(current => [
        ...current, 
        { 
          id: (Date.now() + 1).toString(), 
          type: 'ai', 
          content: `I've analyzed your request: "${input}". In a real implementation, this would connect to your local RAG agent.` 
        }
      ]);
    }, 1000);
    
    setInput('');
  };

  if (!aiAssistantOpen) return null;

  return (
    <div className="fixed right-4 bottom-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-96 z-20">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">AI Assistant</h3>
        <Button variant="ghost" size="icon" onClick={() => setAiAssistantOpen(false)} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-app-blue text-white' 
                  : 'bg-app-gray-light text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
