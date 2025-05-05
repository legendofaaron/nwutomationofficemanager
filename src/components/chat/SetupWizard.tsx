
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface SetupWizardProps {
  messages: Message[];
  onSendResponse: (response: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const SetupWizard = ({ messages, onSendResponse, messagesEndRef }: SetupWizardProps) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [customModelInfo, setCustomModelInfo] = useState({
    enabled: false,
    name: '',
    apiKey: '',
    baseUrl: '',
  });

  const saveCustomModelConfig = () => {
    try {
      const storedConfig = localStorage.getItem('llmConfig');
      const config = storedConfig ? JSON.parse(storedConfig) : {
        endpoint: 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk',
        enabled: true,
        model: 'default'
      };
      
      if (customModelInfo.enabled) {
        config.customModel = {
          name: customModelInfo.name || 'Custom Model',
          apiKey: customModelInfo.apiKey,
          baseUrl: customModelInfo.baseUrl,
          contextLength: 8000,
          isCustom: true
        };
      } else {
        delete config.customModel;
      }
      
      localStorage.setItem('llmConfig', JSON.stringify(config));
      
      toast({
        title: 'Configuration Saved',
        description: customModelInfo.enabled 
          ? `Custom model "${customModelInfo.name}" configured successfully` 
          : 'Using default language model settings'
      });
      
      setIsConfiguring(false);
    } catch (error) {
      toast({
        title: 'Error Saving Configuration',
        description: 'Failed to save custom model settings',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <ScrollArea className="flex-1 p-4 bg-[#0D1117]">
        <div className="space-y-3">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isConfiguring && (
            <div className="p-4 bg-[#161B22] rounded-lg border border-[#30363d] mt-4">
              <h3 className="text-lg font-medium text-white mb-3">Configure Custom Language Model</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-custom-model" className="text-gray-300">
                    Enable Custom Model
                  </Label>
                  <Switch 
                    id="enable-custom-model"
                    checked={customModelInfo.enabled}
                    onCheckedChange={(checked) => setCustomModelInfo(prev => ({...prev, enabled: checked}))}
                  />
                </div>
                
                {customModelInfo.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="custom-model-name" className="text-gray-300">Model Name</Label>
                      <Input
                        id="custom-model-name"
                        value={customModelInfo.name}
                        onChange={(e) => setCustomModelInfo(prev => ({...prev, name: e.target.value}))}
                        placeholder="My Custom Model"
                        className="bg-[#0D1117] border-[#30363d] text-gray-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-model-api-key" className="text-gray-300">API Key</Label>
                      <Input
                        id="custom-model-api-key"
                        type="password"
                        value={customModelInfo.apiKey}
                        onChange={(e) => setCustomModelInfo(prev => ({...prev, apiKey: e.target.value}))}
                        placeholder="sk-..."
                        className="bg-[#0D1117] border-[#30363d] text-gray-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-model-base-url" className="text-gray-300">Base URL (Optional)</Label>
                      <Input
                        id="custom-model-base-url"
                        value={customModelInfo.baseUrl}
                        onChange={(e) => setCustomModelInfo(prev => ({...prev, baseUrl: e.target.value}))}
                        placeholder="https://api.example.com/v1"
                        className="bg-[#0D1117] border-[#30363d] text-gray-200"
                      />
                    </div>
                  </>
                )}
                
                <div className="flex space-x-2 pt-2">
                  <Button onClick={saveCustomModelConfig} className="bg-blue-500 hover:bg-blue-600">
                    Save Configuration
                  </Button>
                  <Button onClick={() => setIsConfiguring(false)} variant="outline" className="border-[#30363d] text-gray-200 hover:bg-[#30363d]/30">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {!isConfiguring ? (
        <div className="border-t border-[#1E2430]/80 bg-[#0D1117] p-3">
          <div className="flex justify-between items-center mb-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsConfiguring(true)}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 text-xs"
            >
              Configure Language Model
            </Button>
          </div>
          <ChatInput 
            onSendMessage={onSendResponse}
            placeholder="Type response..." 
          />
        </div>
      ) : (
        <div className="h-24 bg-[#0D1117]"></div>
      )}
    </>
  );
};
