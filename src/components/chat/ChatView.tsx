
import React, { useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModelSelector } from './ModelSelector';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ModelConfigDialog } from './ModelConfigDialog';
import { z } from 'zod';
import { isLlmConfigured, isModelConfigured } from '@/utils/modelConfig';

interface ChatViewProps {
  className?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ className }) => {
  const [messages, setMessages] = useState<Array<{id: string; type: 'user' | 'ai' | 'system'; content: string;}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [modelConfigOpen, setModelConfigOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, {apiKey: string; baseUrl?: string}>>({});
  const [modelConfigured, setModelConfigured] = useState<boolean>(false);
  
  // Check if model is configured on load and model change
  useEffect(() => {
    const checkModelConfig = () => {
      // For local models, check if LLM is configured
      if (selectedModel === 'local-llm' || selectedModel === 'ollama') {
        const configured = isLlmConfigured();
        setModelConfigured(configured);
        return;
      }
      
      // For other models, check if API key exists
      const hasKey = !!apiKeys[selectedModel]?.apiKey;
      setModelConfigured(hasKey);
    };
    
    checkModelConfig();
  }, [selectedModel, apiKeys]);
  
  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = { id: Date.now().toString(), type: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    
    // Check if model is configured
    if (!modelConfigured) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        type: 'system' as const, 
        content: `Please configure ${selectedModel} in settings first`
      }]);
      setModelConfigOpen(true);
      return;
    }
    
    // Simulate AI response
    setIsLoading(true);
    
    setTimeout(() => {
      const aiResponse = { 
        id: (Date.now() + 1).toString(), 
        type: 'ai' as const, 
        content: `Using ${selectedModel}: I've processed your message using the configured API keys.`
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    
    // Add system message when model is changed
    const systemMessage = {
      id: Date.now().toString(),
      type: 'system' as const,
      content: `Model switched to ${model}`
    };
    
    setMessages(prev => [...prev, systemMessage]);
    
    // Check if model needs configuration
    if (model === 'local-llm' || model === 'ollama') {
      const configured = isLlmConfigured();
      
      if (!configured) {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 2).toString(), 
          type: 'system' as const, 
          content: `${model} needs to be configured in settings`
        }]);
      }
    } else if (!apiKeys[model]?.apiKey) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 3).toString(), 
        type: 'system' as const, 
        content: `Please configure API key for ${model}`
      }]);
      
      // Open model config dialog
      setModelConfigOpen(true);
    }
  };
  
  const handleApiSubmit = (values: z.infer<typeof z.object({apiKey: z.string().min(1), baseUrl: z.string().optional()})>) => {
    setApiKeys(prev => ({
      ...prev,
      [selectedModel]: {
        apiKey: values.apiKey,
        baseUrl: values.baseUrl
      }
    }));
    
    toast({
      title: "API key saved",
      description: `${selectedModel} configuration has been saved.`
    });
    
    setModelConfigured(true);
    setModelConfigOpen(false);
    
    // Add confirmation message
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      type: 'system' as const, 
      content: `${selectedModel} has been configured successfully`
    }]);
  };
  
  const isLocalModel = selectedModel === 'local-llm' || selectedModel === 'ollama';
  
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-black"></div>
            </div>
            <h3 className="text-lg font-medium text-white">Chat</h3>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            onClick={() => setModelConfigOpen(true)}
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </header>
      
      <ModelConfigDialog 
        isOpen={modelConfigOpen}
        onOpenChange={setModelConfigOpen}
        selectedModel={selectedModel}
        onApiSubmit={handleApiSubmit}
        isLocalModel={isLocalModel}
      />
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-400 p-2">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
              <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <ModelSelector 
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        placeholder={modelConfigured ? `Message ${selectedModel}...` : `Configure ${selectedModel} first...`}
        disabled={!modelConfigured}
      />
    </div>
  );
};

