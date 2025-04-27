
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, SendHorizontal } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

const ChatUI = () => {
  const {
    setViewMode,
    setCurrentFile,
    files,
    setCurrentTable,
    databaseTables
  } = useAppContext();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your office assistant. I can help you create and navigate documents, schedules, and more. Just tell me what you'd like to do!"
    }
  ]);
  const [input, setInput] = useState('');

  const handleCommand = (command: string) => {
    const lowercaseCommand = command.toLowerCase();
    
    // Handle document creation
    if (lowercaseCommand.includes('create document') || lowercaseCommand.includes('new document')) {
      const newFile = {
        id: Date.now().toString(),
        name: 'New Document',
        type: 'document' as const,
        content: '# New Document\n\nStart writing here...'
      };
      setCurrentFile(newFile);
      setViewMode('document');
      toast({
        title: "Document Created",
        description: "Opening new document for editing"
      });
    }
    
    // Handle schedule creation
    else if (lowercaseCommand.includes('create schedule') || lowercaseCommand.includes('new schedule')) {
      setViewMode('document');
      toast({
        title: "Schedule Creation",
        description: "Opening schedule creator"
      });
    }
    
    // Handle file navigation
    else if (lowercaseCommand.includes('open')) {
      const fileName = command.toLowerCase().replace('open', '').trim();
      const file = files.find(f => f.name.toLowerCase().includes(fileName));
      if (file) {
        setCurrentFile(file);
        setViewMode('document');
        toast({
          title: "Opening File",
          description: `Opening ${file.name}`
        });
      }
    }
    
    // Handle database table navigation
    else if (lowercaseCommand.includes('show table') || lowercaseCommand.includes('open table')) {
      const tableName = command.toLowerCase().replace('show table', '').replace('open table', '').trim();
      const table = databaseTables.find(t => t.name.toLowerCase().includes(tableName));
      if (table) {
        setCurrentTable(table);
        setViewMode('database');
        toast({
          title: "Opening Table",
          description: `Opening ${table.name} table`
        });
      }
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };
    
    // Process the command
    handleCommand(input);
    
    // Add assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: `I'll help you with that! Processing your request: "${input}"`
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
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
