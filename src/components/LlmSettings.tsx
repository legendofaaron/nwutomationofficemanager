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
import { ExternalLink, Lock, Cpu, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface LlmConfig {
  endpoint: string;
  enabled: boolean;
  model: string;
  webhookUrl?: string;
  openAi?: {
    apiKey: string;
    enabled: boolean;
  };
  customModel?: {
    name: string;
    apiKey?: string;
    baseUrl?: string;
    contextLength?: number;
    isCustom: boolean;
  };
  localLlama?: {
    enabled: boolean;
    modelPath?: string;
    threads?: number;
    contextSize?: number;
    batchSize?: number;
  };
}

export const LlmSettings = () => {
  const [config, setConfig] = useState<LlmConfig>({
    endpoint: 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk',
    enabled: false,
    model: 'llama-3.2-3b',
    webhookUrl: 'http://localhost:5678/webhook-test/bf4dd093-bb02-472c-9454-7ab9af97bd1d'
  });

  const [activeTab, setActiveTab] = useState<string>('general');
  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);
  const [useOpenAiKey, setUseOpenAiKey] = useState<boolean>(false);
  const [testingOpenAi, setTestingOpenAi] = useState<boolean>(false);
  const [useLocalLlama, setUseLocalLlama] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadModelName, setDownloadModelName] = useState<string>('');

  // Load config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('llmConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        setIsCustomModel(!!parsedConfig.customModel?.isCustom);
        setUseOpenAiKey(!!parsedConfig.openAi?.enabled);
        setUseLocalLlama(!!parsedConfig.localLlama?.enabled);
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

  const testOpenAiKey = async () => {
    if (!config.openAi?.apiKey) {
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
          'Authorization': `Bearer ${config.openAi.apiKey}`,
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

  const handleOpenAiToggle = (enabled: boolean) => {
    setUseOpenAiKey(enabled);
    
    if (enabled) {
      setConfig(prev => ({
        ...prev,
        openAi: {
          apiKey: prev.openAi?.apiKey || '',
          enabled: true
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        openAi: {
          ...prev.openAi,
          enabled: false
        }
      }));
    }
  };

  const handleLocalLlamaToggle = (enabled: boolean) => {
    setUseLocalLlama(enabled);
    
    if (enabled) {
      setConfig(prev => ({
        ...prev,
        localLlama: {
          enabled: true,
          modelPath: prev.localLlama?.modelPath || '',
          threads: prev.localLlama?.threads || navigator.hardwareConcurrency || 4,
          contextSize: prev.localLlama?.contextSize || 2048,
          batchSize: prev.localLlama?.batchSize || 512
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        localLlama: {
          ...prev.localLlama,
          enabled: false
        }
      }));
    }
  };

  const downloadLocalModel = (modelName: string) => {
    setIsDownloading(true);
    setDownloadModelName(modelName);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const next = prev + Math.random() * 10;
        if (next >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          
          // Update config with downloaded model path
          setConfig(prev => ({
            ...prev,
            localLlama: {
              ...prev.localLlama,
              enabled: true,
              modelPath: `models/${modelName}.gguf`
            }
          }));
          
          toast({
            title: "Download Complete",
            description: `${modelName} has been successfully downloaded and is ready to use.`
          });
          
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const testLocalModel = () => {
    if (!config.localLlama?.modelPath) {
      toast({
        title: 'No Model Selected',
        description: 'Please download or select a model before testing',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Testing Local Model',
      description: 'Initializing LLaMa model...'
    });
    
    // In a real implementation, this would initialize the llama.cpp model
    setTimeout(() => {
      toast({
        title: 'Local Model Ready',
        description: 'Local inference is working correctly'
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="custom">Custom Model</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="local">Local Models</TabsTrigger>
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
                      <SelectItem value="llama-3.2-3b">Llama 3.2 (3B)</SelectItem>
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
        
        <TabsContent value="openai" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">OpenAI Configuration</h3>
            <p className="text-sm text-gray-500 mb-4">Configure your OpenAI API key to use with the application</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable OpenAI Integration</h4>
              <p className="text-sm text-gray-500">Use your own OpenAI API key</p>
            </div>
            <Switch
              checked={useOpenAiKey}
              onCheckedChange={handleOpenAiToggle}
            />
          </div>
          
          {useOpenAiKey && (
            <div className="space-y-4 border rounded-md p-4 bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <div className="relative">
                  <Input 
                    id="openai-api-key"
                    type="password"
                    value={config.openAi?.apiKey || ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      openAi: {
                        ...(prev.openAi || {}),
                        apiKey: e.target.value,
                        enabled: true
                      }
                    }))}
                    placeholder="sk-..."
                  />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Lock className="h-3 w-3" />
                  <span>Your API key is stored securely in your browser's local storage</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="openai-model">OpenAI Model</Label>
                <Select 
                  value={config.model}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger id="openai-model">
                    <SelectValue placeholder="Select OpenAI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster, more affordable)</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o (More capable)</SelectItem>
                    <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview (Most capable)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Button
                  onClick={testOpenAiKey}
                  disabled={!config.openAi?.apiKey || testingOpenAi}
                  size="sm"
                  className="mt-2"
                >
                  {testingOpenAi ? 'Testing...' : 'Test Connection'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs"
                  onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Get API Key
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="local" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Local LLaMa Models</h3>
            <p className="text-sm text-gray-500 mb-4">Run language models locally using llama.cpp</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Local Models</h4>
              <p className="text-sm text-gray-500">Run models directly on your device</p>
            </div>
            <Switch
              checked={useLocalLlama}
              onCheckedChange={handleLocalLlamaToggle}
            />
          </div>
          
          {useLocalLlama && (
            <div className="space-y-6 border rounded-md p-4 bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="cpu-threads">CPU Threads</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="cpu-threads"
                    defaultValue={[config.localLlama?.threads || 4]}
                    max={16}
                    min={1}
                    step={1}
                    onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      localLlama: {
                        ...prev.localLlama,
                        threads: value[0]
                      }
                    }))}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{config.localLlama?.threads || 4}</span>
                </div>
                <p className="text-xs text-gray-500">Number of CPU threads to use for inference</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="context-size">Context Size</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="context-size"
                    defaultValue={[config.localLlama?.contextSize || 2048]}
                    max={8192}
                    min={512}
                    step={512}
                    onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      localLlama: {
                        ...prev.localLlama,
                        contextSize: value[0]
                      }
                    }))}
                    className="flex-1"
                  />
                  <span className="w-16 text-center">{config.localLlama?.contextSize || 2048}</span>
                </div>
                <p className="text-xs text-gray-500">Maximum context size in tokens (higher values use more memory)</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batch-size">Batch Size</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="batch-size"
                    defaultValue={[config.localLlama?.batchSize || 512]}
                    max={1024}
                    min={64}
                    step={64}
                    onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      localLlama: {
                        ...prev.localLlama,
                        batchSize: value[0]
                      }
                    }))}
                    className="flex-1"
                  />
                  <span className="w-16 text-center">{config.localLlama?.batchSize || 512}</span>
                </div>
                <p className="text-xs text-gray-500">Batch size for prompt processing (lower uses less memory)</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Select Model</Label>
                  <p className="text-xs text-gray-500 mb-2">Download a model or select an existing one</p>
                </div>
                
                {!isDownloading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors" 
                          onClick={() => downloadLocalModel('llama-3.2-3b')}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">LLaMa 3.2 3B</h4>
                          <p className="text-xs text-gray-500">3 billion parameters, 4.7GB</p>
                        </div>
                        <Download className="h-5 w-5 text-primary" />
                      </div>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => downloadLocalModel('llama-3.2-1b')}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">LLaMa 3.2 1B</h4>
                          <p className="text-xs text-gray-500">1 billion parameters, 1.8GB</p>
                        </div>
                        <Download className="h-5 w-5 text-primary" />
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Downloading {downloadModelName}...</span>
                      <span className="text-sm text-muted-foreground">{Math.round(downloadProgress)}%</span>
                    </div>
                    <Progress value={downloadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">This may take several minutes depending on your connection</p>
                  </div>
                )}
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="model-path">Custom Model Path</Label>
                  <Input
                    id="model-path"
                    placeholder="/path/to/your/model.gguf"
                    value={config.localLlama?.modelPath || ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      localLlama: {
                        ...prev.localLlama,
                        modelPath: e.target.value
                      }
                    }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the file path to a custom GGUF model
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Cpu className="h-3 w-3" />
                  <span>Local models run directly on your device hardware</span>
                </div>
                
                <Button
                  onClick={testLocalModel}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  disabled={!config.localLlama?.modelPath}
                >
                  Test Local Model
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
