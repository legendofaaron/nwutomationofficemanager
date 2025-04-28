
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Bot, Calendar, FileText, Receipt, ScanSearch, Info, Settings, Shield } from 'lucide-react';
import { LlmSettings } from './LlmSettings';
import { queryLlm } from '@/utils/llm';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

const AiAssistant = () => {
  const { aiAssistantOpen, setAiAssistantOpen } = useAppContext();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      type: 'ai', 
      content: `👋 Welcome to Office Manager RAG Assistant!

I'm a locally-hosted Retrieval Augmented Generation (RAG) agent designed to help you with office tasks while maintaining complete data privacy. I can assist with:

📄 Document Creation
- Professional text documents
- Reports and memos
- Custom templates

📅 Schedule Management
- Calendar planning
- Meeting organization
- Task scheduling

💼 Office Administration
- Resource management
- Process optimization
- Administrative support

🛡️ Privacy-Focused
- All data remains local
- No external data collection
- Configurable language models

You can:
1. Use the quick action buttons above
2. Type natural language commands
3. Configure my settings to match your preferences

How can I assist you with your office tasks today?`
    }
  ]);

  const quickActions = [
    { icon: FileText, label: 'Create Document', action: () => handleQuickAction('create document') },
    { icon: Calendar, label: 'Manage Schedule', action: () => handleQuickAction('manage schedule') },
    { icon: Receipt, label: 'Office Admin', action: () => handleQuickAction('office administration') },
    { icon: Shield, label: 'Privacy Info', action: () => handleQuickAction('privacy information') },
    { icon: Info, label: 'How to Use', action: () => handleQuickAction('explain capabilities') }
  ];

  const [config, setConfig] = useState({
    endpoint: 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk',
    enabled: false
  });

  const handleQuickAction = (action: string) => {
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, type: 'user', content: action }]);
    
    let response = '';
    switch (action) {
      case 'create document':
        response = "I'll assist you with document creation. What type of document would you like to generate?";
        break;
      case 'manage schedule':
        response = "Let's organize your schedule. Would you like to create a new schedule, review existing appointments, or set up a recurring event?";
        break;
      case 'office administration':
        response = "I can help with office administration tasks. Would you like assistance with resource management, process optimization, or administrative support?";
        break;
      case 'privacy information':
        response = `Office Manager is designed with privacy as a core principle:

1. Local Processing: All data processing occurs on your local system
2. No Data Collection: Your information is never sent to external servers
3. Configurable Models: You control which language model is used
4. Secure Storage: All data remains within your network

Your data remains entirely under your control at all times.`;
        break;
      case 'explain capabilities':
        response = `As a RAG (Retrieval Augmented Generation) assistant, I can help you with:

1. Document Management: Create, edit, and organize documents with intelligent assistance
2. Schedule Organization: Manage calendars, appointments, and recurring events
3. Office Administration: Streamline processes and manage resources efficiently
4. Knowledge Retrieval: Access information from your knowledge base to enhance responses

To use me effectively:
- Be specific with your requests
- Configure my settings to select your preferred language model
- Use the quick action buttons for common tasks
- Provide context when needed for more accurate assistance

How can I help you today?`;
        break;
      default:
        response = "I'll assist you with that request.";
    }
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), type: 'ai', content: response }
      ]);
    }, 500);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessageId = Date.now().toString();
    setMessages([...messages, { id: userMessageId, type: 'user', content: input }]);
    
    try {
      const response = await queryLlm(input, config.endpoint);
      
      setMessages(current => [
        ...current,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.message
        }
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from local RAG agent. Please check your connection to the selected language model.',
        variant: 'destructive'
      });
    }
    
    setInput('');
  };

  if (!aiAssistantOpen) return null;

  return (
    <div className="fixed right-4 bottom-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[600px] z-20">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-app-blue" />
          <h3 className="font-medium">Office Manager</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(!showSettings)}
            className="h-6 w-6"
            title="Configure Language Model"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setAiAssistantOpen(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showSettings ? (
        <LlmSettings />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default AiAssistant;
