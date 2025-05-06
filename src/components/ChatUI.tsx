import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Settings } from 'lucide-react';
import { LlmSettings } from './LlmSettings';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { ChatHeader } from './chat/ChatHeader';
import { ChatContainer } from './chat/ChatContainer';
import { Message } from './chat/MessageBubble';
import { queryLlm, isLlmConfigured, getLlmConfig, generateDocumentContent, loadLlamaModel } from '@/utils/llm';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileSettingsDrawer } from './settings/MobileSettingsDrawer';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';

const ChatUI = () => {
  const { aiAssistantOpen, setAiAssistantOpen, assistantConfig, setAssistantConfig, 
         files, setFiles, currentFile, setCurrentFile, setViewMode } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const isMobile = useIsMobile();
  const [useN8nChat, setUseN8nChat] = useState(false);
  const [currentLlmConfig, setCurrentLlmConfig] = useState<any>(null);
  const [activeLlamaModel, setActiveLlamaModel] = useState<any>(null);
  const [isModelConfigured, setIsModelConfigured] = useState(false);
  const navigate = useNavigate();
  const { checkAccess, PremiumFeatureGate } = usePremiumFeature();

  // Use effect to sync with aiAssistantOpen state from context
  useEffect(() => {
    setIsOpen(aiAssistantOpen);
  }, [aiAssistantOpen]);
  
  // Load LLM config and check if model is configured
  useEffect(() => {
    const checkLlmConfiguration = async () => {
      try {
        // Get current LLM configuration
        const config = getLlmConfig();
        setCurrentLlmConfig(config);
        
        // Check if a valid configuration exists
        const configured = isLlmConfigured();
        setIsModelConfigured(configured);
        
        // If we have a local model path, try to load it
        if (config?.localLlama?.enabled && config.localLlama.modelPath) {
          try {
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
          } catch (err) {
            console.error("Error loading local model:", err);
          }
        }
        
        // If no configuration exists, prompt to configure in settings
        if (!configured && isOpen) {
          setShowSettings(true);
        }
      } catch (error) {
        console.error("Error checking LLM configuration:", error);
      }
    };
    
    checkLlmConfiguration();
  }, [isOpen]);
  
  // Function to detect if the request is related to document content generation
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
    // Check if this is a premium feature
    if (!checkAccess('Document Generation')) return;
    
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

  // Handle message sending with local LLM
  const handleSendMessage = async (input: string) => {
    // For advanced AI requests, check premium access
    if (input.toLowerCase().includes('customize') || 
        input.toLowerCase().includes('advanced') || 
        input.toLowerCase().includes('train') || 
        isDocumentContentRequest(input)) {
      if (!checkAccess('Advanced AI Features')) return;
    }
    
    if (isLoading || !isModelConfigured) return;
    
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
      const systemContext = `You are a local language model assistant${assistantConfig?.companyName ? ` for ${assistantConfig.companyName}` : ''}. 
      Be concise, helpful, and direct in your responses.`;
      
      // Check if the request is for document content generation
      if (isDocumentContentRequest(input)) {
        // Generate document content
        const documentContent = await generateDocumentContent(input, "general");
        
        // Update or create document with generated content
        updateDocumentWithContent(documentContent);
        
        // Add a response to the chat from the LLM about the document creation
        const responseText = await queryLlm(
          "I've just created a document based on the user's request. Tell them it's ready.",
          config.endpoint || '',
          'local',
          undefined,
          systemContext
        );
        
        setMessages(prev => [
          ...prev, 
          { id: Date.now().toString(), type: 'ai', content: responseText.message }
        ]);
      } else {
        // Handle regular chat messages with local model
        const responseText = await queryLlm(
          input,
          config.endpoint || '',
          'local',
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
      
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          type: 'ai', 
          content: "I'm unable to process your request. Please check your local LLM configuration."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick actions
  const handleQuickAction = async (action: string) => {
    // For advanced AI actions, check premium access
    if (action.toLowerCase().includes('customize') || 
        action.toLowerCase().includes('advanced') || 
        action.toLowerCase().includes('train') || 
        action === 'create document') {
      if (!checkAccess('Advanced AI Features')) return;
    }
    
    if (isLoading || !isModelConfigured) return;
    
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, type: 'user', content: action }]);
    
    setIsLoading(true);
    
    try {
      // Get stored configuration - use local model
      const config = getLlmConfig() || {
        model: 'local',
        localLlama: { enabled: true }
      };
      
      // Create a system context
      const systemContext = `You are a local language model assistant${assistantConfig?.companyName ? ` for ${assistantConfig.companyName}` : ''}. 
      Be concise, helpful, and direct.`;
      
      // Query the LLM directly for all actions
      const responseText = await queryLlm(
        action,
        config.endpoint || '',
        'local',
        undefined,
        systemContext
      );
      
      setMessages(prev => [
        ...prev, 
        { id: Date.now().toString(), type: 'ai', content: responseText.message }
      ]);
        
      // If the action is a document creation request, also create the document
      if (action === 'create document') {
        // Generate a sample document
        const documentPrompt = "Create a professional business document template with sections for executive summary, introduction, background, analysis, recommendations, and conclusion.";
        const documentContent = await generateDocumentContent(documentPrompt, "business");
        
        // Create new document with generated content
        updateDocumentWithContent(documentContent, "New Business Document");
      }

    } catch (error) {
      console.error('Error handling quick action:', error);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          type: 'ai', 
          content: "I'm unable to process that action. Please check your local LLM configuration."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  
  // Handle toggle chat with theme-aware styling and prevent event propagation
  const handleToggleChat = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const newState = !isOpen;
    setIsOpen(newState);
    setAiAssistantOpen(newState);
  };

  const handleOpenSettings = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (checkAccess('AI Settings')) {
      setShowSettings(!showSettings);
    }
  };

  // Fixed visibility logic to correctly render chat or button
  if (!isOpen) {
    const getButtonStyles = () => {
      if (resolvedTheme === 'superdark') {
        return 'bg-blue-600 hover:bg-blue-700 shadow-superdark text-white';
      }
      if (resolvedTheme === 'dark') {
        return 'bg-[#4661F1] hover:bg-[#3A51D6] shadow-md text-white';
      }
      return 'bg-blue-500 hover:bg-blue-600 shadow-lg text-white';
    };

    return (
      <Button
        onClick={handleToggleChat}
        className={`fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 hover:shadow-xl transition-all border-none z-50 ${getButtonStyles()}`}
        aria-label="Open chat assistant"
      >
        <Bot className="h-5 w-5" />
      </Button>
    );
  }

  // Get theme-specific styles for the chat container
  const getChatContainerStyles = () => {
    if (resolvedTheme === 'superdark') {
      return 'bg-black border-[#181818]/80 shadow-superdark';
    }
    if (resolvedTheme === 'dark') {
      return 'bg-[#0D1117] border-[#1E2430]/80 shadow-xl';
    }
    return 'bg-white border-gray-200 shadow-xl';
  };

  return (
    <div 
      className={`fixed right-0 bottom-0 ${isMobile ? 'w-full left-0' : 'right-4 bottom-4 w-[400px]'} 
        ${getChatContainerStyles()} rounded-xl border flex flex-col 
        ${isMobile ? 'h-[90vh] z-50 rounded-b-none' : 'h-[550px] z-20'} overflow-hidden`}
      onClick={(e) => e.stopPropagation()}
    >
      
      <ChatHeader 
        assistantName={assistantConfig?.name || 'Local LLM Assistant'} 
        companyName={assistantConfig?.companyName}
        onCloseClick={handleToggleChat}
        onSettingsClick={handleOpenSettings}
        useN8n={useN8nChat}
        onToggleN8n={() => {
          if (checkAccess('N8N Integration')) {
            setUseN8nChat(!useN8nChat);
          }
        }}
      />
      
      {showSettings ? (
        isMobile ? (
          <MobileSettingsDrawer 
            open={showSettings} 
            onClose={() => setShowSettings(false)} 
            useN8nChat={useN8nChat}
            onToggleN8n={() => {
              if (checkAccess('N8N Integration')) {
                setUseN8nChat(!useN8nChat);
              }
            }}
          />
        ) : (
          <LlmSettings 
            onConfigured={() => {
              setIsModelConfigured(true);
              setShowSettings(false);
            }} 
          />
        )
      ) : (
        <ChatContainer 
          messages={messages}
          onSendMessage={handleSendMessage}
          onQuickAction={handleQuickAction}
          isLoading={isLoading}
          assistantName={assistantConfig?.name || 'Local LLM Assistant'}
          assistantPurpose="provide assistance using local language processing"
          companyName={assistantConfig?.companyName}
          useN8n={useN8nChat}
          isModelConfigured={isModelConfigured}
          onOpenModelSettings={handleOpenSettings}
        />
      )}
      
      <PremiumFeatureGate />
    </div>
  );
};

export default ChatUI;
