import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Bot, Calendar, FileText, Receipt, ScanSearch, Info } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

const AiAssistant = () => {
  const { aiAssistantOpen, setAiAssistantOpen } = useAppContext();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      type: 'ai', 
      content: `👋 Hi! I'm your Office Assistant. I can help you with:

- Creating new documents
- Setting up schedules
- Generating invoices
- Analyzing receipts

Just click one of the quick actions below or type your request in the chat. I'm here to help you stay organized and efficient!`
    }
  ]);

  const quickActions = [
    { icon: FileText, label: 'Create Document', action: () => handleQuickAction('create document') },
    { icon: Calendar, label: 'Create Schedule', action: () => handleQuickAction('create schedule') },
    { icon: Receipt, label: 'Create Invoice', action: () => handleQuickAction('create invoice') },
    { icon: ScanSearch, label: 'Analyze Receipt', action: () => handleQuickAction('analyze receipt') },
    { icon: Info, label: 'How to use', action: () => handleQuickAction('explain how to use') }
  ];

  const handleQuickAction = (action: string) => {
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, type: 'user', content: action }]);
    
    let response = '';
    switch (action) {
      case 'create document':
        response = "I'll help you create a new document. What type of document would you like to create?";
        break;
      case 'create schedule':
        response = "Let's create a schedule. What kind of schedule would you like to set up?";
        break;
      case 'create invoice':
        response = "I'll help you generate an invoice. Who is this invoice for?";
        break;
      case 'analyze receipt':
        response = "I can help analyze your receipt. Please upload or share the receipt details with me.";
        break;
      case 'explain how to use':
        response = `Here's how you can use me effectively:

1. Quick Actions: Use the buttons above for common tasks
2. Chat Commands: Type natural requests like "create a new document" or "set up a meeting schedule"
3. Document Management: I can help organize and create various types of documents
4. Receipt Analysis: Upload receipts and I'll help extract important information
5. Scheduling: I can help you create and manage schedules

Need anything specific? Just ask!`;
        break;
      default:
        response = "I'll help you with that request.";
    }
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), type: 'ai', content: response }
      ]);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessageId = Date.now().toString();
    setMessages([...messages, { id: userMessageId, type: 'user', content: input }]);
    
    const lowercaseInput = input.toLowerCase();
    if (lowercaseInput.includes('document')) {
      handleQuickAction('create document');
    } else if (lowercaseInput.includes('schedule')) {
      handleQuickAction('create schedule');
    } else if (lowercaseInput.includes('invoice')) {
      handleQuickAction('create invoice');
    } else if (lowercaseInput.includes('receipt')) {
      handleQuickAction('analyze receipt');
    } else if (lowercaseInput.includes('help') || lowercaseInput.includes('how')) {
      handleQuickAction('explain how to use');
    } else {
      setTimeout(() => {
        setMessages(current => [
          ...current, 
          { 
            id: (Date.now() + 1).toString(), 
            type: 'ai', 
            content: `I understand you'd like to "${input}". How can I best help you with that?` 
          }
        ]);
      }, 500);
    }
    
    setInput('');
  };

  if (!aiAssistantOpen) return null;

  return (
    <div className="fixed right-4 bottom-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[600px] z-20">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-app-blue" />
          <h3 className="font-medium">Office Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setAiAssistantOpen(false)} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 p-3 border-b">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={action.action}
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
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
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
