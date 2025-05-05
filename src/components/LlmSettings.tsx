
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export interface LlmConfig {
  endpoint: string;
  enabled: boolean;
  model: string;
  webhookUrl?: string;
  customModel?: {
    name: string;
    apiKey?: string;
    baseUrl?: string;
    contextLength?: number;
    isCustom: boolean;
  };
}

export const LlmSettings = () => {
  const [config, setConfig] = useState<LlmConfig>({
    endpoint: 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk',
    enabled: false,
    model: 'default',
    webhookUrl: 'http://localhost:5678/webhook-test/bf4dd093-bb02-472c-9454-7ab9af97bd1d'
  });

  const [activeTab, setActiveTab] = useState<string>('general');
  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);

  // Load config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('llmConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        setIsCustomModel(!!parsedConfig.customModel?.isCustom);
      } catch (error) {
        console.error('Failed to parse saved LLM config:', error);
      }
    }
  }, []);

  // Save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('llmConfig', JSON.stringify(config));
  }, [config]);

  const testConnection = async () => {
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Test connection",
          model: config.model,
          customModel: config.customModel
        }),
      });
      
      if (response.ok) {
        toast({
          title: 'Connection Successful',
          description: 'Successfully connected to the language model'
        });
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to the specified endpoint. Please check your configuration.',
        variant: 'destructive'
      });
    }
  };

  const testWebhook = async () => {
    if (!config.webhookUrl) {
      toast({
        title: 'Missing Webhook URL',
        description: 'Please enter a webhook URL to test',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Test webhook connection",
          timestamp: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        toast({
          title: 'Webhook Test Successful',
          description: 'Successfully connected to webhook endpoint'
        });
      } else {
        throw new Error('Failed to connect to webhook');
      }
    } catch (error) {
      toast({
        title: 'Webhook Test Failed',
        description: 'Could not connect to webhook. Please check your URL and ensure the endpoint is running.',
        variant: 'destructive'
      });
    }
  };

  const handleModelTypeChange = (isCustom: boolean) => {
    setIsCustomModel(isCustom);
    if (isCustom) {
      setConfig(prev => ({
        ...prev,
        customModel: {
          name: prev.customModel?.name || 'My Custom Model',
          apiKey: prev.customModel?.apiKey || '',
          baseUrl: prev.customModel?.baseUrl || '',
          contextLength: prev.customModel?.contextLength || 4000,
          isCustom: true
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        model: 'default',
        customModel: undefined
      }));
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="custom">Custom Model</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Language Model Settings</h3>
              <p className="text-sm text-gray-500">Configure your language model connection</p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Workflow Endpoint</Label>
              <Input
                id="endpoint"
                value={config.endpoint}
                onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="http://localhost:5678/workflow/[ID]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                value={config.webhookUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="http://localhost:5678/webhook-test/[ID]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the webhook URL for bidirectional communication
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="model-type">Model Type</Label>
                <Switch 
                  id="custom-model-toggle"
                  checked={isCustomModel}
                  onCheckedChange={handleModelTypeChange}
                />
                <Label htmlFor="custom-model-toggle" className="text-sm ml-2">
                  Use Custom Model
                </Label>
              </div>
              
              {!isCustomModel && (
                <div className="mt-4">
                  <Label htmlFor="model">Predefined Model</Label>
                  <Select
                    value={config.model}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}
                    disabled={isCustomModel}
                  >
                    <SelectTrigger id="model" className="w-full">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
                      <SelectItem value="llama-3.1-8b">Llama 3.1 (8B)</SelectItem>
                      <SelectItem value="llama-3.1-70b">Llama 3.1 (70B)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <Button onClick={testConnection}>
                Test Connection
              </Button>
              <Button onClick={testWebhook} variant="outline">
                Test Webhook
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Custom Language Model</h3>
            <p className="text-sm text-gray-500 mb-4">Configure your own language model settings</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-name">Model Name</Label>
              <Input
                id="custom-name"
                value={config.customModel?.name || ''}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  customModel: {
                    ...prev.customModel,
                    name: e.target.value,
                    isCustom: true
                  }
                }))}
                placeholder="My Custom Model"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-api-key">API Key</Label>
              <Input
                id="custom-api-key"
                type="password"
                value={config.customModel?.apiKey || ''}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  customModel: {
                    ...prev.customModel,
                    apiKey: e.target.value,
                    isCustom: true
                  }
                }))}
                placeholder="sk-..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Your API key will be stored locally in your browser
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-base-url">Base URL (Optional)</Label>
              <Input
                id="custom-base-url"
                value={config.customModel?.baseUrl || ''}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  customModel: {
                    ...prev.customModel,
                    baseUrl: e.target.value,
                    isCustom: true
                  }
                }))}
                placeholder="https://api.example.com/v1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use the default endpoint
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-context-length">Context Length</Label>
              <Input
                id="custom-context-length"
                type="number"
                value={config.customModel?.contextLength || 4000}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  customModel: {
                    ...prev.customModel,
                    contextLength: parseInt(e.target.value) || 4000,
                    isCustom: true
                  }
                }))}
                min={1000}
                max={100000}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of tokens this model can process
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
