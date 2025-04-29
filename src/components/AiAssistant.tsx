
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Bot, Calendar, FileText, Receipt, ScanSearch, Info, Settings } from 'lucide-react';
import { LlmSettings } from './LlmSettings';
import { queryLlm } from '@/utils/llm';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
}

type SetupStep = 'welcome' | 'name' | 'company' | 'purpose' | 'complete' | null;

const AiAssistant = () => {
  const { aiAssistantOpen, setAiAssistantOpen, assistantConfig, setAssistantConfig } = useAppContext();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [currentSetupStep, setCurrentSetupStep] = useState<SetupStep>(null);
  const [setupData, setSetupData] = useState({
    name: assistantConfig?.name || 'Office Manager',
    companyName: assistantConfig?.companyName || '',
    companyDescription: assistantConfig?.companyDescription || '',
    purpose: assistantConfig?.purpose || ''
  });
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      type: 'ai', 
      content: `👋 Welcome to Office Manager

I'm your intelligent assistant designed to help you streamline office tasks efficiently. Here's what I can do for you:

📄 Document Creation
- Draft new documents
- Create reports and memos
- Generate templates

📅 Schedule Management
- Organize daily/weekly schedules
- Set up meeting arrangements
- Prioritize tasks

💵 Invoice Management
- Generate professional invoices
- Track payment statuses
- Maintain billing records

🧾 Receipt Processing
- Extract data from receipts
- Organize receipt information
- Maintain financial records

You can:
1. Use the quick action buttons above
2. Type natural language requests like "create a new document"
3. Ask questions about any feature

Your data remains secure on your local system. Need assistance? Just ask me anything!`
    }
  ]);

  // Check if setup is needed when assistant opens
  useEffect(() => {
    if (aiAssistantOpen && !assistantConfig?.companyName) {
      const shouldStartSetup = !setupData.companyName;
      if (shouldStartSetup) {
        startSetupProcess();
      }
    }
  }, [aiAssistantOpen, assistantConfig]);

  const startSetupProcess = () => {
    setIsSetupMode(true);
    setCurrentSetupStep('welcome');
    
    // Add welcome setup message
    setMessages([
      {
        id: Date.now().toString(), 
        type: 'system', 
        content: "🔧 Setup Mode"
      },
      {
        id: (Date.now() + 1).toString(), 
        type: 'ai', 
        content: `I notice this is your first time using the assistant. Let's take a moment to personalize it for you. I'll guide you through a quick setup process.

Would you like to:
1. Start the guided setup now
2. Go to the setup page for more detailed configuration
3. Skip setup for now`
      }
    ]);
  };

  const handleSetupResponse = (response: string) => {
    // Add user response to messages
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, type: 'user', content: response }]);
    
    // Process response based on current setup step
    switch (currentSetupStep) {
      case 'welcome':
        if (response.toLowerCase().includes('1') || response.toLowerCase().includes('start')) {
          processNextSetupStep('name');
        } else if (response.toLowerCase().includes('2') || response.toLowerCase().includes('setup page')) {
          navigate('/setup-assistant');
          setAiAssistantOpen(false);
          return;
        } else {
          // Skip setup
          setIsSetupMode(false);
          setCurrentSetupStep(null);
          setMessages(prev => [...prev, { 
            id: (Date.now() + 1).toString(), 
            type: 'ai', 
            content: "No problem! You can always configure me later through the setup page. How can I help you today?" 
          }]);
        }
        break;
        
      case 'name':
        setSetupData(prev => ({ ...prev, name: response }));
        processNextSetupStep('company');
        break;
        
      case 'company':
        setSetupData(prev => ({ ...prev, companyName: response }));
        processNextSetupStep('purpose');
        break;
        
      case 'purpose':
        setSetupData(prev => ({ ...prev, purpose: response }));
        processNextSetupStep('complete');
        break;
        
      case 'complete':
        if (response.toLowerCase().includes('yes')) {
          // Navigate to full setup
          navigate('/setup-assistant');
          setAiAssistantOpen(false);
        } else {
          // Save settings and exit setup mode
          completeSetup();
        }
        break;
    }
  };

  const processNextSetupStep = (nextStep: SetupStep) => {
    setCurrentSetupStep(nextStep);
    
    let message = '';
    switch (nextStep) {
      case 'name':
        message = "What would you like to name your assistant?";
        break;
      case 'company':
        message = "Great! What's the name of your company or organization?";
        break;
      case 'purpose':
        message = "What kind of tasks would you like me to help you with primarily? (e.g., document creation, schedule management, invoice processing)";
        break;
      case 'complete':
        message = `Thank you! I've saved your basic setup:

- Assistant name: ${setupData.name}
- Company: ${setupData.companyName}
- Primary tasks: ${setupData.purpose}

Would you like to go to the full setup page for more detailed configuration?`;
        break;
    }
    
    setMessages(prev => [...prev, { 
      id: (Date.now() + 1).toString(), 
      type: 'ai', 
      content: message 
    }]);
  };

  const completeSetup = () => {
    // Save to context
    if (setAssistantConfig) {
      setAssistantConfig({
        name: setupData.name,
        companyName: setupData.companyName,
        purpose: setupData.purpose
      });
    }
    
    // Exit setup mode
    setIsSetupMode(false);
    setCurrentSetupStep(null);
    
    // Add completion message
    setMessages(prev => [...prev, { 
      id: (Date.now() + 1).toString(), 
      type: 'ai', 
      content: `Perfect! Your assistant is now set up as "${setupData.name}" for ${setupData.companyName}. I'll focus on helping you with ${setupData.purpose}.

How can I assist you today?` 
    }]);
  };

  const quickActions = [
    { icon: FileText, label: 'Create Document', action: () => handleQuickAction('create document') },
    { icon: Calendar, label: 'Create Schedule', action: () => handleQuickAction('create schedule') },
    { icon: Receipt, label: 'Create Invoice', action: () => handleQuickAction('create invoice') },
    { icon: ScanSearch, label: 'Analyze Receipt', action: () => handleQuickAction('analyze receipt') },
    { icon: Info, label: 'How to use', action: () => handleQuickAction('explain how to use') }
  ];

  const handleQuickAction = (action: string) => {
    if (isSetupMode) return;
    
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, type: 'user', content: action }]);
    
    let response = '';
    switch (action) {
      case 'create document':
        response = "I'd be happy to help you create a new document. What type of document would you like to create?";
        break;
      case 'create schedule':
        response = "Let's organize a schedule for you. What type of schedule would you like to create?";
        break;
      case 'create invoice':
        response = "I can help you generate a professional invoice. Who will be the recipient of this invoice?";
        break;
      case 'analyze receipt':
        response = "I can assist with receipt analysis. Please upload or share the receipt details so I can process the information.";
        break;
      case 'explain how to use':
        response = `Here's how to make the most of ${assistantConfig?.name || 'Office Manager'}:

1. Quick Actions: Use the buttons above for common tasks
2. Natural Language: Type requests like "create a new document" or "set up a meeting schedule"
3. Document Management: Create, organize, and manage various document types
4. Receipt Processing: Upload receipts for information extraction and organization
5. Schedule Management: Create and organize calendars and schedules

Your data remains secure on your local system. How can I assist you today?`;
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

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // If in setup mode, process as setup response
    if (isSetupMode) {
      handleSetupResponse(input);
      setInput('');
      return;
    }
    
    const userMessageId = Date.now().toString();
    setMessages([...messages, { id: userMessageId, type: 'user', content: input }]);
    
    try {
      // Simple AI response simulation for immediate feedback
      setTimeout(() => {
        setMessages(current => [
          ...current,
          {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `I'll help you with "${input}". How would you like to proceed?`
          }
        ]);
      }, 800);
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the assistant. Please try again later.',
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
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium">Office Manager</h3>
          {assistantConfig?.companyName && (
            <span className="text-xs text-gray-500">for {assistantConfig.companyName}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(!showSettings)}
            className="h-6 w-6"
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
          {!isSetupMode && (
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
          )}
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${
                  message.type === 'user' 
                    ? 'justify-end' 
                    : message.type === 'system' 
                      ? 'justify-center' 
                      : 'justify-start'
                }`}
              >
                <div 
                  className={`${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white max-w-[80%] p-3 rounded-lg' 
                      : message.type === 'system'
                        ? 'bg-gray-200 text-gray-800 px-4 py-1 rounded-full text-xs font-medium'
                        : 'bg-gray-100 text-gray-800 max-w-[80%] p-3 rounded-lg'
                  } whitespace-pre-wrap`}
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
                placeholder={isSetupMode ? "Type your response..." : "Type your message..."}
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
