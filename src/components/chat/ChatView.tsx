
import React, { useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModelSelector } from './ModelSelector';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isLlmConfigured } from '@/utils/llm';

interface ChatViewProps {
  className?: string;
}

// API key configuration schema
const apiFormSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  baseUrl: z.string().optional(),
});

export const ChatView: React.FC<ChatViewProps> = ({ className }) => {
  const [messages, setMessages] = useState<Array<{id: string; type: 'user' | 'ai' | 'system'; content: string;}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [modelConfigOpen, setModelConfigOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, {apiKey: string; baseUrl?: string}>>({});
  const [modelConfigured, setModelConfigured] = useState<boolean>(false);
  
  // Form for API key configuration
  const form = useForm({
    resolver: zodResolver(apiFormSchema),
    defaultValues: {
      apiKey: "",
      baseUrl: "",
    },
  });

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
  
  const handleApiSubmit = (values: z.infer<typeof apiFormSchema>) => {
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
    
    // Reset form
    form.reset({
      apiKey: "",
      baseUrl: "",
    });
  };
  
  // Get placeholder text based on model type
  const getApiFieldPlaceholder = () => {
    if (selectedModel.includes('gpt')) return 'sk-...';
    if (selectedModel.includes('claude')) return 'sk-ant-...';
    if (selectedModel.includes('gemini')) return 'aig-...';
    return 'API key';
  };
  
  const getUrlFieldVisible = () => {
    return !selectedModel.includes('gpt') && 
           !selectedModel.includes('claude') && 
           !selectedModel.includes('gemini');
  };
  
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
          
          <Dialog open={modelConfigOpen} onOpenChange={setModelConfigOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Configure {selectedModel}</DialogTitle>
              </DialogHeader>
              
              {(selectedModel === 'local-llm' || selectedModel === 'ollama') ? (
                <div className="py-4 space-y-4">
                  <p className="text-sm">
                    To configure {selectedModel}, please visit the settings page and set up your local language model.
                  </p>
                  <Button 
                    onClick={() => {
                      setModelConfigOpen(false);
                      // This would normally navigate to settings, but for now we'll just show a toast
                      toast({
                        title: "Local model settings",
                        description: "In a full implementation, this would open the local model configuration."
                      });
                    }}
                  >
                    Open Settings
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleApiSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={getApiFieldPlaceholder()} 
                              type="password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {getUrlFieldVisible() && (
                      <FormField
                        control={form.control}
                        name="baseUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base URL (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://api.example.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setModelConfigOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </Form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </header>
      
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
