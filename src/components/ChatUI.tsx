
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { LlmSettings } from './LlmSettings';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { ChatHeader } from './chat/ChatHeader';
import { ChatContainer } from './chat/ChatContainer';
import { SetupWizard } from './chat/SetupWizard';
import { Message } from './chat/MessageBubble';
import { queryLlm } from '@/utils/llm';

type SetupStep = 'welcome' | 'name' | 'company' | 'purpose' | 'complete' | null;

const ChatUI = () => {
  const { aiAssistantOpen, setAiAssistantOpen, assistantConfig, setAssistantConfig } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
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
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  const [isLoading, setIsLoading] = useState(false);

  // Use effect to sync with aiAssistantOpen state from context
  useEffect(() => {
    setIsOpen(aiAssistantOpen);
  }, [aiAssistantOpen]);
  
  // Generate welcome message based on assistant config
  const generateWelcomeMessage = (): Message => {
    const name = assistantConfig?.name || 'Office Manager';
    const company = assistantConfig?.companyName ? ` at ${assistantConfig.companyName}` : '';
    const purpose = assistantConfig?.purpose || 'office tasks and document management';
    
    return { 
      id: '1', 
      type: 'ai', 
      content: `👋 Welcome to ${name}${company}

I'm your intelligent assistant designed to help you streamline ${purpose} efficiently. Here's what I can do for you:

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
    };
  };
  
  const [messages, setMessages] = useState<Message[]>([
    generateWelcomeMessage()
  ]);

  // Update welcome message when assistant config changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([generateWelcomeMessage()]);
    }
  }, [assistantConfig]);

  // Check if setup is needed when assistant opens
  useEffect(() => {
    if (isOpen && !assistantConfig?.companyName) {
      const shouldStartSetup = !setupData.companyName;
      if (shouldStartSetup) {
        startSetupProcess();
      }
    }
  }, [isOpen, assistantConfig]);

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
          setIsOpen(false);
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
          setIsOpen(false);
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

  const handleQuickAction = async (action: string) => {
    if (isSetupMode || isLoading) return;
    
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, type: 'user', content: action }]);
    
    setIsLoading(true);
    
    // Try to get response from LLM if configured
    const storedConfig = localStorage.getItem('llmConfig');
    const config = storedConfig ? JSON.parse(storedConfig) : null;
    const isLlmConfigured = config && (
      (config.openAi?.enabled && config.openAi?.apiKey) || 
      (config.customModel?.isCustom && config.customModel?.apiKey)
    );
    
    if (isLlmConfigured) {
      try {
        const prompt = `As ${assistantConfig?.name || 'Office Manager'} for ${assistantConfig?.companyName || 'the user'}, 
          respond to this user action: "${action}". 
          Purpose: ${assistantConfig?.purpose || 'help with office tasks'}.
          Give a helpful response to get started with this action.`;
        
        const response = await queryLlm(prompt, config.endpoint, config.model);
        
        setMessages(prev => [
          ...prev, 
          { id: Date.now().toString(), type: 'ai', content: response.message }
        ]);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Error getting LLM response:', error);
        // Fall back to default responses
      }
    }
    
    // Default responses if LLM is not configured or fails
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
      setIsLoading(false);
    }, 500);
  };

  const handleSendMessage = async (input: string) => {
    // If in setup mode, process as setup response
    if (isSetupMode) {
      handleSetupResponse(input);
      return;
    }
    
    if (isLoading) return;
    
    const userMessageId = Date.now().toString();
    setMessages([...messages, { id: userMessageId, type: 'user', content: input }]);
    
    setIsLoading(true);
    
    try {
      // Check for LLM configuration
      const storedConfig = localStorage.getItem('llmConfig');
      const config = storedConfig ? JSON.parse(storedConfig) : null;
      const isLlmConfigured = config && (
        (config.openAi?.enabled && config.openAi?.apiKey) || 
        (config.customModel?.isCustom && config.customModel?.apiKey)
      );
      
      if (isLlmConfigured) {
        try {
          const prompt = `As ${assistantConfig?.name || 'Office Manager'} for ${assistantConfig?.companyName || 'the user'}, 
            respond to: "${input}". 
            Purpose: ${assistantConfig?.purpose || 'help with office tasks'}.
            Be helpful, informative, and conversational.`;
          
          const response = await queryLlm(prompt, config.endpoint, config.model);
          
          setMessages(current => [
            ...current,
            { id: Date.now().toString(), type: 'ai', content: response.message }
          ]);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Error getting LLM response:', error);
          // Fall back to default response
        }
      }
      
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
        setIsLoading(false);
      }, 800);
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the assistant. Please try again later.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    setAiAssistantOpen(!isOpen);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={handleToggleChat}
        className="fixed bottom-4 right-4 h-11 w-11 rounded-full p-0 shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 text-white border-none"
        aria-label="Open chat assistant"
      >
        <Bot className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 w-[320px] bg-[#0D1117] rounded-xl shadow-2xl border border-[#1E2430]/80 flex flex-col h-[520px] z-20 overflow-hidden">
      <ChatHeader 
        assistantName={assistantConfig?.name || 'Office Manager'} 
        companyName={assistantConfig?.companyName}
        onSettingsClick={() => setShowSettings(!showSettings)}
        onCloseClick={() => handleToggleChat()}
      />
      
      {showSettings ? (
        <LlmSettings />
      ) : isSetupMode ? (
        <SetupWizard 
          messages={messages}
          onSendResponse={handleSetupResponse}
          messagesEndRef={messagesEndRef}
        />
      ) : (
        <ChatContainer 
          messages={messages}
          onSendMessage={handleSendMessage}
          onQuickAction={handleQuickAction}
          isSetupMode={isSetupMode}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ChatUI;
