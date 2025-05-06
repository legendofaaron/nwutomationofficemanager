
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import ChatInput from './ChatInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ThumbsUp, Send, Save } from 'lucide-react';

interface SetupWizardProps {
  messages: Message[];
  onSendResponse: (response: string) => void;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ 
  messages, 
  onSendResponse,
  messagesEndRef
}) => {
  const [inputValue, setInputValue] = useState('');
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupConfig, setSetupConfig] = useState({
    name: '',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: '',
    useOpenAI: true,
    model: 'gpt-4o-mini'
  });
  const [testingOpenAi, setTestingOpenAi] = useState(false);
  const [saving, setSaving] = useState(false);

  // Define the handleSendMessage function to fix the TS error
  const handleSendMessage = (message: string) => {
    if (onSendResponse) {
      onSendResponse(message);
    }
  };

  const updateSetupProgress = () => {
    let progress = 0;
    if (setupConfig.name) progress += 25;
    if (setupConfig.endpoint) progress += 25;
    if (setupConfig.useOpenAI && setupConfig.apiKey) progress += 50;
    if (!setupConfig.useOpenAI) progress += 50;
    setSetupProgress(progress);
  };

  useEffect(() => {
    updateSetupProgress();
  }, [setupConfig]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      onSendResponse(inputValue.trim());
      setInputValue('');
    }
  };

  const handleSaveAndLaunch = async () => {
    setSaving(true);
    try {
      // Save API key and other configuration to localStorage
      const llmConfig = {
        endpoint: setupConfig.endpoint,
        enabled: true,
        model: setupConfig.model,
        webhookUrl: '',
        openAi: {
          apiKey: setupConfig.apiKey,
          enabled: setupConfig.useOpenAI
        }
      };
      
      localStorage.setItem('llmConfig', JSON.stringify(llmConfig));
      
      // Send confirmation message to user
      onSendResponse("Save and launch assistant");
      
      // Wait a bit before considering it complete
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[#1E2430]/80 bg-[#0D1117] flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xs font-medium text-gray-400">Setup Progress:</span>
          <div className="w-24 h-2 bg-gray-800 rounded-full ml-2">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${setupProgress}%` }}
            ></div>
          </div>
        </div>
        <span className="text-xs text-gray-400">{setupProgress}%</span>
      </div>
      
      <ScrollArea className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {setupProgress >= 75 && (
          <div className="mt-4 mb-2">
            <Button 
              onClick={handleSaveAndLaunch}
              disabled={saving || setupProgress < 75}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save & Launch Assistant</span>
                </>
              )}
            </Button>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t border-[#1E2430]/80">
        <form onSubmit={handleSubmit} className="flex">
          <ChatInput 
            onSendMessage={handleSendMessage}
            isLoading={false} 
            disabled={false}
          />
        </form>
      </div>
    </div>
  );
};
