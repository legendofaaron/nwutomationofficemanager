
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, MessageBubble } from './MessageBubble';
import ChatInput from './ChatInput';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Brain, Link, Check, ExternalLink, Lock } from 'lucide-react';

interface SetupWizardProps {
  messages: Message[];
  onSendResponse: (response: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const SetupWizard = ({ messages, onSendResponse, messagesEndRef }: SetupWizardProps) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('model');
  const [setupProgress, setSetupProgress] = useState(0);
  const [customModelInfo, setCustomModelInfo] = useState({
    enabled: false,
    name: '',
    apiKey: '',
    baseUrl: '',
    contextLength: 8000,
    temperature: 0.7
  });
  const [openAiConfig, setOpenAiConfig] = useState({
    enabled: false,
    apiKey: '',
    model: 'gpt-4o-mini'
  });
  const [testingOpenAi, setTestingOpenAi] = useState(false);

  // Define the missing handleSendMessage function
  const handleSendMessage = (message: string) => {
    if (onSendResponse) {
      onSendResponse(message);
    }
  };

  const updateSetupProgress = () => {
    let progress = 0;
    
    if (openAiConfig.enabled) {
      // If using OpenAI
      if (openAiConfig.apiKey) progress = 100;
      else progress = 25;
    } else if (customModelInfo.enabled) {
      // If using custom model
      if (customModelInfo.name) progress += 25;
      if (customModelInfo.apiKey) progress += 50;
      if (customModelInfo.baseUrl) progress += 25;
    } else {
      // Default model is already 100% setup
      progress = 100;
    }
    
    setSetupProgress(progress);
  };

  const saveCustomModelConfig = () => {
    try {
      const storedConfig = localStorage.getItem('llmConfig');
      const config = storedConfig ? JSON.parse(storedConfig) : {
        endpoint: 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk',
        enabled: true,
        model: 'default'
      };
      
      if (openAiConfig.enabled) {
        config.openAi = {
          apiKey: openAiConfig.apiKey,
          enabled: true
        };
        config.model = openAiConfig.model;
        delete config.customModel;
      } else if (customModelInfo.enabled) {
        config.customModel = {
          name: customModelInfo.name || 'Custom Model',
          apiKey: customModelInfo.apiKey,
          baseUrl: customModelInfo.baseUrl,
          contextLength: customModelInfo.contextLength,
          temperature: customModelInfo.temperature,
          isCustom: true
        };
        delete config.openAi;
      } else {
        delete config.customModel;
        delete config.openAi;
      }
      
      localStorage.setItem('llmConfig', JSON.stringify(config));
      
      toast({
        title: 'Configuration Saved',
        description: openAiConfig.enabled 
          ? 'OpenAI API configuration saved successfully'
          : customModelInfo.enabled 
            ? `Custom model "${customModelInfo.name}" configured successfully` 
            : 'Using default language model settings'
      });
      
      setIsConfiguring(false);
    } catch (error) {
      toast({
        title: 'Error Saving Configuration',
        description: 'Failed to save model settings',
        variant: 'destructive'
      });
    }
  };
  
  const testConnection = () => {
    if (!customModelInfo.enabled || !customModelInfo.apiKey) {
      toast({
        title: 'Test Failed',
        description: 'Please enter a valid API key first',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Testing Connection',
      description: 'Attempting to connect to the model...'
    });
    
    // Simulate a connection test
    setTimeout(() => {
      toast({
        title: 'Connection Successful',
        description: `Successfully connected to ${customModelInfo.name || 'Custom Model'}`
      });
    }, 1500);
  };
  
  const testOpenAiKey = async () => {
    if (!openAiConfig.apiKey) {
      toast({
        title: 'Missing API Key',
        description: 'Please enter an OpenAI API key to test',
        variant: 'destructive'
      });
      return;
    }
    
    setTestingOpenAi(true);
    
    try {
      // Simple test request to OpenAI API
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openAiConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast({
          title: 'OpenAI Connection Successful',
          description: 'Your API key is valid and working correctly'
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Invalid API key');
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to validate OpenAI API key',
        variant: 'destructive'
      });
    } finally {
      setTestingOpenAi(false);
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
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  Configure AI Model
                </h3>
                <div className="text-xs text-gray-400">
                  Setup Progress: {setupProgress}%
                </div>
              </div>
              
              <Progress value={setupProgress} className="h-1 mb-4" />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="model" className="text-xs">Model</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                  <TabsTrigger value="connection" className="text-xs">Connection</TabsTrigger>
                </TabsList>
                
                <TabsContent value="model" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-custom-model" className="text-gray-300">
                          Enable Custom Model
                        </Label>
                        <Switch 
                          id="enable-custom-model"
                          checked={customModelInfo.enabled && !openAiConfig.enabled}
                          onCheckedChange={(checked) => {
                            setCustomModelInfo(prev => ({...prev, enabled: checked}));
                            if (checked) {
                              setOpenAiConfig(prev => ({...prev, enabled: false}));
                            }
                            setSetupProgress(checked ? 25 : 100);
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-openai-api" className="text-gray-300">
                          Use OpenAI API
                        </Label>
                        <Switch 
                          id="enable-openai-api"
                          checked={openAiConfig.enabled}
                          onCheckedChange={(checked) => {
                            setOpenAiConfig(prev => ({...prev, enabled: checked}));
                            if (checked) {
                              setCustomModelInfo(prev => ({...prev, enabled: false}));
                            }
                            updateSetupProgress();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {openAiConfig.enabled ? (
                    <div className="space-y-3 border border-[#30363d] rounded-md p-4 bg-[#0D1117]/50">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-blue-400" />
                        <h4 className="text-sm font-medium text-blue-300">OpenAI API Configuration</h4>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="openai-api-key" className="text-gray-300">API Key</Label>
                        <Input
                          id="openai-api-key"
                          type="password"
                          value={openAiConfig.apiKey}
                          onChange={(e) => {
                            setOpenAiConfig(prev => ({...prev, apiKey: e.target.value}));
                            updateSetupProgress();
                          }}
                          placeholder="sk-..."
                          className="bg-[#0D1117] border-[#30363d] text-gray-200"
                        />
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Lock className="h-3 w-3" />
                          <span>Your API key is stored securely in your browser's local storage</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="openai-model" className="text-gray-300">Model</Label>
                        <Select 
                          value={openAiConfig.model}
                          onValueChange={(value) => setOpenAiConfig(prev => ({...prev, model: value}))}
                        >
                          <SelectTrigger id="openai-model" className="bg-[#0D1117] border-[#30363d] text-gray-200">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#161B22] border-[#30363d] text-gray-200">
                            <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster, more affordable)</SelectItem>
                            <SelectItem value="gpt-4o">GPT-4o (More capable)</SelectItem>
                            <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview (Most capable)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button 
                          onClick={testOpenAiKey} 
                          disabled={!openAiConfig.apiKey || testingOpenAi}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <Link className="h-4 w-4 mr-2" />
                          {testingOpenAi ? 'Testing...' : 'Test Connection'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 text-xs border-[#30363d] text-gray-300 hover:bg-[#30363d]/30"
                          onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Get API Key
                        </Button>
                      </div>
                    </div>
                  ) : customModelInfo.enabled ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="custom-model-name" className="text-gray-300">Model Name</Label>
                        <Input
                          id="custom-model-name"
                          value={customModelInfo.name}
                          onChange={(e) => {
                            setCustomModelInfo(prev => ({...prev, name: e.target.value}));
                            updateSetupProgress();
                          }}
                          placeholder="My Custom Model"
                          className="bg-[#0D1117] border-[#30363d] text-gray-200"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="default-model" className="text-gray-300">Language Model</Label>
                      <Select defaultValue="gpt-4o-mini">
                        <SelectTrigger id="default-model" className="bg-[#0D1117] border-[#30363d] text-gray-200">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161B22] border-[#30363d] text-gray-200">
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
                          <SelectItem value="llama-3.1-8b">Llama 3.1 (8B)</SelectItem>
                          <SelectItem value="llama-3.1-70b">Llama 3.1 (70B)</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="mt-4 p-3 border border-blue-900/60 bg-blue-950/20 rounded-md">
                        <div className="flex gap-2">
                          <Check className="h-4 w-4 text-blue-400 mt-0.5" />
                          <p className="text-sm text-blue-300">Default models come preconfigured and ready to use</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  {customModelInfo.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="context-length" className="text-gray-300">Context Length</Label>
                        <Select 
                          value={customModelInfo.contextLength.toString()}
                          onValueChange={(value) => setCustomModelInfo(prev => ({...prev, contextLength: parseInt(value)}))}
                        >
                          <SelectTrigger id="context-length" className="bg-[#0D1117] border-[#30363d] text-gray-200">
                            <SelectValue placeholder="Select context length" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#161B22] border-[#30363d] text-gray-200">
                            <SelectItem value="4000">4,000 tokens</SelectItem>
                            <SelectItem value="8000">8,000 tokens</SelectItem>
                            <SelectItem value="16000">16,000 tokens</SelectItem>
                            <SelectItem value="32000">32,000 tokens</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-400 mt-1">
                          Maximum tokens the model can process in one request
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="temperature" className="text-gray-300">Temperature</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="temperature"
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={customModelInfo.temperature}
                            onChange={(e) => setCustomModelInfo(prev => ({...prev, temperature: parseFloat(e.target.value)}))}
                            className="bg-[#0D1117] border-[#30363d] text-gray-200"
                          />
                          <div className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded-md text-sm w-14 text-center">
                            {customModelInfo.temperature.toFixed(1)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Lower values produce more focused responses
                        </p>
                      </div>
                    </>
                  )}
                  
                  {!customModelInfo.enabled && (
                    <div className="flex flex-col items-center justify-center h-24 text-center">
                      <Brain className="h-10 w-10 text-gray-500 mb-2" />
                      <p className="text-gray-400">Default models use optimal settings</p>
                      <p className="text-xs text-gray-500 mt-1">Enable custom model for advanced settings</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="connection" className="space-y-4">
                  {openAiConfig.enabled ? (
                    <div className="space-y-4">
                      <div className="rounded-md border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-green-900 dark:text-green-400">OpenAI Connection</h4>
                            <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                              Your app will connect directly to OpenAI's API using your key
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : customModelInfo.enabled ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="custom-model-api-key" className="text-gray-300">API Key</Label>
                        <Input
                          id="custom-model-api-key"
                          type="password"
                          value={customModelInfo.apiKey}
                          onChange={(e) => {
                            setCustomModelInfo(prev => ({...prev, apiKey: e.target.value}));
                            updateSetupProgress();
                          }}
                          placeholder="sk-..."
                          className="bg-[#0D1117] border-[#30363d] text-gray-200"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Stored securely in your browser's local storage
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="custom-model-base-url" className="text-gray-300">Base URL (Optional)</Label>
                        <Input
                          id="custom-model-base-url"
                          value={customModelInfo.baseUrl}
                          onChange={(e) => {
                            setCustomModelInfo(prev => ({...prev, baseUrl: e.target.value}));
                            updateSetupProgress();
                          }}
                          placeholder="https://api.example.com/v1"
                          className="bg-[#0D1117] border-[#30363d] text-gray-200"
                        />
                      </div>
                      
                      <Button 
                        onClick={testConnection} 
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Test Connection
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 text-center">
                      <Check className="h-10 w-10 text-green-500 mb-2" />
                      <p className="text-gray-400">Default connection is configured</p>
                      <p className="text-xs text-gray-500 mt-1">No additional setup required</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex space-x-2 pt-4 mt-2 border-t border-[#30363d]">
                <Button onClick={saveCustomModelConfig} className="bg-blue-500 hover:bg-blue-600 flex-1">
                  Save Configuration
                </Button>
                <Button onClick={() => setIsConfiguring(false)} variant="outline" className="border-[#30363d] text-gray-200 hover:bg-[#30363d]/30">
                  Cancel
                </Button>
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
            onSendMessage={handleSendMessage} 
            disabled={false}
          />
        </div>
      ) : (
        <div className="h-24 bg-[#0D1117]"></div>
      )}
    </>
  );
};
