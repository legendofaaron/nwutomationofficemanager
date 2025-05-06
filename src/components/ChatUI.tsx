
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';
import { LlmSettings } from './LlmSettings';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { ChatHeader } from './chat/ChatHeader';
import { ChatContainer } from './chat/ChatContainer';
import { SetupWizard } from './chat/SetupWizard';
import { Message } from './chat/MessageBubble';
import { queryLlm, isLlmConfigured, getLlmConfig } from '@/utils/llm';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  const [isLoading, setIsLoading] = useState(false);
  const [connectionTested, setConnectionTested] = useState(false);

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

  // Check if API is configured on component mount
  useEffect(() => {
    const checkApiConfiguration = async () => {
      // Check if LLM is configured
      const isConfigured = isLlmConfigured();
      if (isConfigured && !connectionTested) {
        // Maybe test connection here later
        setConnectionTested(true);
      }
    };
    
    checkApiConfiguration();
  }, []);

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

  const handleSetupResponse = async (response: string) => {
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

  const callLlmApi = async (userPrompt: string): Promise<string> => {
    try {
      // Get stored configuration
      const config = getLlmConfig();
      if (!config) {
        throw new Error('No LLM configuration found');
      }
      
      // Create a system context
      const systemContext = `You are ${assistantConfig?.name || 'Office Manager'}, an AI assistant for ${assistantConfig?.companyName || 'the user'}. 
      Your purpose is to ${assistantConfig?.purpose || 'help with office tasks'}.
      Be concise, helpful, and direct.
      IMPORTANT: Always respond directly without prefacing your response with phrases like "I'll help you with..." or "How would you like to proceed?". 
      Just answer the query directly as if continuing a conversation.`;
      
      // Call the LLM API with proper system context
      const response = await queryLlm(userPrompt, config.endpoint, config.model, undefined, systemContext);
      return response.message;
    } catch (error) {
      console.error('Error calling LLM API:', error);
      return `I'm having trouble connecting to my language model. Please check your API configuration in settings.`;
    }
  };

  const handleQuickAction = async (action: string) => {
    if (isSetupMode || isLoading) return;
    
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, type: 'user', content: action }]);
    
    setIsLoading(true);
    
    try {
      // Check if LLM is configured
      if (isLlmConfigured()) {
        const responseText = await callLlmApi(action);
        setMessages(prev => [
          ...prev, 
          { id: Date.now().toString(), type: 'ai', content: responseText }
        ]);
      } else {
        // Fall back to default responses if LLM is not configured
        let response = '';
        switch (action) {
          case 'create document':
            response = "To get started with document creation, please set up your AI model in settings first.";
            break;
          case 'create schedule':
            response = "To help you organize a schedule, please configure your AI model in settings first.";
            break;
          case 'create invoice':
            response = "To generate an invoice, please set up your AI model in settings first.";
            break;
          case 'analyze receipt':
            response = "To analyze receipts, please configure your AI model in settings first.";
            break;
          case 'explain how to use':
            response = `To use ${assistantConfig?.name || 'Office Manager'} effectively, please set up your AI model in settings first. This will enable all assistant features.`;
            break;
          default:
            response = "Please configure your AI model in settings to enable full assistant functionality.";
        }
        
        setTimeout(() => {
          setMessages(prev => [
            ...prev, 
            { id: Date.now().toString(), type: 'ai', content: response }
          ]);
        }, 500);
      }
    } catch (error) {
      console.error('Error handling quick action:', error);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          type: 'ai', 
          content: "I encountered an error processing your request. Please check your API configuration in settings."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
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
      // Check if LLM is configured
      if (isLlmConfigured()) {
        const responseText = await callLlmApi(input);
        setMessages(prev => [
          ...prev, 
          { id: Date.now().toString(), type: 'ai', content: responseText }
        ]);
      } else {
        // Simple AI response telling user to configure API
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              type: 'ai',
              content: `To get a helpful response, please configure an AI model in the settings first. Click the gear icon in the top-right corner of this chat window.`
            }
          ]);
        }, 500);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the assistant. Please check your API configuration.',
        variant: 'destructive'
      });
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          type: 'ai', 
          content: "I encountered an error processing your request. Please check your API configuration in settings."
        }
      ]);
    } finally {
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
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 text-white border-none"
        aria-label="Open chat assistant"
      >
        <Bot className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 w-[350px] bg-[#0D1117] rounded-xl shadow-xl border border-[#1E2430]/80 flex flex-col h-[550px] z-20 overflow-hidden">
      <ChatHeader 
        assistantName={assistantConfig?.name || 'My Assistant'} 
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
          assistantName={assistantConfig?.name || 'Office Manager'}
          assistantPurpose={assistantConfig?.purpose || 'help with tasks'}
          companyName={assistantConfig?.companyName}
        />
      )}
    </div>
  );
};

export default ChatUI;
