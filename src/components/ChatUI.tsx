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
import { queryLlm, isLlmConfigured, getLlmConfig, generateDocumentContent, loadLlamaModel } from '@/utils/llm';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileSettingsDrawer } from './settings/MobileSettingsDrawer';

type SetupStep = 'welcome' | 'name' | 'company' | 'purpose' | 'complete' | null;

const ChatUI = () => {
  const { aiAssistantOpen, setAiAssistantOpen, assistantConfig, setAssistantConfig, 
         files, setFiles, currentFile, setCurrentFile, setViewMode } = useAppContext();
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
  const isMobile = useIsMobile();
  const [useN8nChat, setUseN8nChat] = useState(false);
  const [currentLlmConfig, setCurrentLlmConfig] = useState<any>(null);
  const [activeLlamaModel, setActiveLlamaModel] = useState<any>(null);

  // Use effect to sync with aiAssistantOpen state from context
  useEffect(() => {
    setIsOpen(aiAssistantOpen);
  }, [aiAssistantOpen]);
  
  // Generate welcome message based on assistant config
  const generateWelcomeMessage = (): Message => {
    const name = assistantConfig?.name || 'Office Manager';
    const company = assistantConfig?.companyName ? ` at ${assistantConfig.companyName}` : '';
    
    return { 
      id: '1', 
      type: 'ai', 
      content: `Hello! I'm ${name}${company}, your personal AI assistant.

I can help you with many tasks, including:
- Creating documents and reports
- Managing your schedule
- Generating invoices 
- Processing receipts

How can I assist you today?`
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

  // Load LLM config and initialize local model if needed
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get current LLM configuration
        const config = getLlmConfig();
        setCurrentLlmConfig(config);
        
        // If no configuration exists yet, create a default one with local LLama enabled
        if (!config) {
          const defaultConfig = {
            model: 'local',
            localLlama: {
              enabled: true,
              threads: navigator.hardwareConcurrency || 4,
              contextSize: 2048,
              batchSize: 512
            }
          };
          
          localStorage.setItem('llmConfig', JSON.stringify(defaultConfig));
          setCurrentLlmConfig(defaultConfig);
        }
        
        // Initialize local model if needed
        if (config?.localLlama?.enabled && config.localLlama.modelPath) {
          console.log("Loading local LLama model:", config.localLlama.modelPath);
          
          const model = await loadLlamaModel(
            config.localLlama.modelPath, 
            {
              threads: config.localLlama.threads || 4,
              contextSize: config.localLlama.contextSize || 2048,
              batchSize: config.localLlama.batchSize || 512
            }
          );
          
          setActiveLlamaModel(model);
          console.log("Local model loaded successfully:", model);
          
          // Indicate that connection is ready
          setConnectionTested(true);
        } else {
          // Mark as ready even without a model
          setConnectionTested(true);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        setConnectionTested(true); // Still mark as ready to avoid blocking the UI
      }
    };
    
    initializeChat();
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
        content: `I notice this is your first time using the assistant. Let's take a moment to personalize it for you.

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

  // New function to detect if the request is related to document content generation
  const isDocumentContentRequest = (message: string): boolean => {
    const lowerMsg = message.toLowerCase();
    return (
      (lowerMsg.includes('write') || lowerMsg.includes('create') || lowerMsg.includes('generate')) &&
      (lowerMsg.includes('document') || lowerMsg.includes('content') || lowerMsg.includes('report') || 
       lowerMsg.includes('story') || lowerMsg.includes('article') || lowerMsg.includes('essay'))
    );
  };
  
  // Function to create or update document with generated content
  const updateDocumentWithContent = (content: string, documentName?: string) => {
    // If there's a current document open, update it
    if (currentFile && currentFile.type === 'document') {
      const updatedFile = { ...currentFile, content };
      setCurrentFile(updatedFile);
      
      // Update in files tree
      const updateFiles = (filesArray: any[]): any[] => {
        return filesArray.map(file => {
          if (file.id === currentFile.id) {
            return updatedFile;
          }
          if (file.children) {
            return { ...file, children: updateFiles(file.children) };
          }
          return file;
        });
      };
      
      setFiles(updateFiles(files));
      toast({
        title: "Document updated",
        description: "Content has been added to your current document",
        duration: 2000,
      });
    } else {
      // Create a new document with the generated content
      const newDocName = documentName || "Generated Document";
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: newDocName,
        type: "document" as const,
        content
      };
      
      setFiles([...files, newDoc]);
      setCurrentFile(newDoc);
      setViewMode('document');
      
      toast({
        title: "New document created",
        description: `"${newDocName}" has been created with the generated content`,
        duration: 2000,
      });
    }
  };

  // Modified function to handle message sending with local LLM as default
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
      // Get stored configuration - prefer local model when available
      const config = getLlmConfig() || {
        model: 'local',
        localLlama: { enabled: true }
      };
      
      // Create a system context based on assistant configuration
      const systemContext = `You are ${assistantConfig?.name || 'Office Manager'}, an AI assistant for ${assistantConfig?.companyName || 'the user'}. 
      Your purpose is to ${assistantConfig?.purpose || 'help with office tasks'}.
      Be concise, helpful, and direct.
      Always respond directly without prefacing your response.`;
      
      // Check if the request is for document content generation
      if (isDocumentContentRequest(input)) {
        // Generate document content
        const documentContent = await generateDocumentContent(input, "general");
        
        // Update or create document with generated content
        updateDocumentWithContent(documentContent);
        
        // Add a response to the chat about the document creation
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now().toString(), 
            type: 'ai', 
            content: `I've created a document based on your request. You can find it in your document list.` 
          }
        ]);
      } else {
        // Handle regular chat messages - default to local model
        const responseText = await queryLlm(
          input,
          config.endpoint || '',
          config.localLlama?.enabled ? 'local' : config.openAi?.enabled ? 'gpt-4o-mini' : 'local',
          undefined,
          systemContext
        );
        
        setMessages(prev => [
          ...prev, 
          { id: Date.now().toString(), type: 'ai', content: responseText.message }
        ]);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      
      // Provide a graceful fallback response
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          type: 'ai', 
          content: "I'm having trouble processing your request right now. Please try again or check your AI model settings."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Modified function to handle quick actions with local LLM as default
  const handleQuickAction = async (action: string) => {
    if (isSetupMode || isLoading) return;
    
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, type: 'user', content: action }]);
    
    setIsLoading(true);
    
    try {
      // Get stored configuration - prefer local model
      const config = getLlmConfig() || {
        model: 'local',
        localLlama: { enabled: true }
      };
      
      // Determine model to use based on configuration - default to local
      const modelToUse = config.localLlama?.enabled ? 'local' : 
                        config.openAi?.enabled ? 'gpt-4o-mini' : 'local';
      
      // Create a system context
      const systemContext = `You are ${assistantConfig?.name || 'Office Manager'}, an AI assistant for ${assistantConfig?.companyName || 'the user'}. 
      Your purpose is to ${assistantConfig?.purpose || 'help with office tasks'}.
      Be concise, helpful, and direct.`;
      
      // Check if the quick action is for document creation
      if (action === 'create document') {
        // Generate a sample document
        const documentPrompt = "Create a professional business document template with sections for executive summary, introduction, background, analysis, recommendations, and conclusion.";
        const documentContent = await generateDocumentContent(documentPrompt, "business");
        
        // Create new document with generated content
        updateDocumentWithContent(documentContent, "New Business Document");
        
        // Add response to chat about the document creation
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now().toString(), 
            type: 'ai', 
            content: `I've created a new business document template for you. You can find it in your document list.` 
          }
        ]);
      } else {
        // Handle other quick actions normally with local model by default
        const responseText = await queryLlm(
          action,
          config.endpoint || '',
          modelToUse,
          undefined,
          systemContext
        );
        
        setMessages(prev => [
          ...prev, 
          { id: Date.now().toString(), type: 'ai', content: responseText.message }
        ]);
      }
    } catch (error) {
      console.error('Error handling quick action:', error);
      // Provide a graceful fallback response
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          type: 'ai', 
          content: "I'm having trouble processing that action right now. Please try again later."
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
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 text-white border-none z-50"
        aria-label="Open chat assistant"
      >
        <Bot className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className={`fixed right-0 bottom-0 ${isMobile ? 'w-full left-0' : 'right-4 bottom-4 w-[400px]'} 
      bg-[#0D1117] rounded-xl shadow-xl border border-[#1E2430]/80 flex flex-col 
      ${isMobile ? 'h-[90vh] z-50 rounded-b-none' : 'h-[550px] z-20'} overflow-hidden`}>
      <ChatHeader 
        assistantName={assistantConfig?.name || 'Office Manager'} 
        companyName={assistantConfig?.companyName}
        onSettingsClick={() => setShowSettings(!showSettings)}
        onCloseClick={() => handleToggleChat()}
        useN8n={useN8nChat}
        onToggleN8n={() => setUseN8nChat(!useN8nChat)}
      />
      
      {showSettings ? (
        isMobile ? (
          <MobileSettingsDrawer 
            open={showSettings} 
            onClose={() => setShowSettings(false)} 
            useN8nChat={useN8nChat}
            onToggleN8n={() => setUseN8nChat(!useN8nChat)}
          />
        ) : (
          <LlmSettings />
        )
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
          useN8n={useN8nChat}
        />
      )}
    </div>
  );
};

export default ChatUI;
