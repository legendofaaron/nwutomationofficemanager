
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2, Settings } from 'lucide-react';
import { LlmSettings } from './LlmSettings';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { ChatHeader } from './chat/ChatHeader';
import { ChatContainer } from './chat/ChatContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileSettingsDrawer } from './settings/MobileSettingsDrawer';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';
import { useChat } from '@/hooks/useChat';
import { isLlmConfigured } from '@/utils/modelConfig';

const ChatUI = () => {
  const { aiAssistantOpen, setAiAssistantOpen, assistantConfig, 
         files, setFiles, currentFile, setCurrentFile, setViewMode } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  const isMobile = useIsMobile();
  const [useN8nChat, setUseN8nChat] = useState(false);
  const [isModelConfigured, setIsModelConfigured] = useState(false);
  const navigate = useNavigate();
  const { checkAccess, PremiumFeatureGate } = usePremiumFeature();

  // Use effect to sync with aiAssistantOpen state from context
  useEffect(() => {
    setIsOpen(aiAssistantOpen);
  }, [aiAssistantOpen]);
  
  // Check if model is configured
  useEffect(() => {
    setIsModelConfigured(isLlmConfigured());
  }, [isOpen]);
  
  // Initialize the chat hook
  const { messages, isLoading, sendMessage, quickAction } = useChat({
    assistantName: assistantConfig?.name || 'Local LLM Assistant',
    companyName: assistantConfig?.companyName,
    checkPremiumAccess: checkAccess,
    onDocumentGenerated: (content: string, documentName?: string) => {
      // Function to create or update document with generated content
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
    }
  });
  
  // Handle toggle chat
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
    return (
      <Button
        onClick={handleToggleChat}
        className={`fixed left-4 sm:left-6 bottom-20 h-12 w-12 rounded-full p-0 hover:shadow-xl transition-all border-none z-50 ${
          resolvedTheme === 'superdark'
            ? 'bg-blue-600 hover:bg-blue-700 shadow-superdark text-white'
            : resolvedTheme === 'dark'
            ? 'bg-[#4661F1] hover:bg-[#3A51D6] shadow-md text-white'
            : 'bg-blue-500 hover:bg-blue-600 shadow-lg text-white'
        }`}
        aria-label="Open chat assistant"
      >
        <MessageSquare className="h-5 w-5" />
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
      className={`fixed left-4 sm:left-20 bottom-4 ${isMobile ? 'w-[calc(100%-32px)]' : 'w-[400px]'} 
        ${getChatContainerStyles()} rounded-xl border flex flex-col 
        ${isMobile ? 'h-[80vh] z-50' : 'h-[550px] z-20'} overflow-hidden`}
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
          onSendMessage={sendMessage}
          onQuickAction={quickAction}
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
