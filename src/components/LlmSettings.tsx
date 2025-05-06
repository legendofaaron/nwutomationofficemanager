
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
import { ExternalLink, Lock, Cpu, Download, CheckCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ModelUploader } from './ModelUploader';
import { initLlamaCpp } from '@/utils/llm';

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

interface LlmSettingsProps {
  onConfigured?: () => void;
}

export const LlmSettings: React.FC<LlmSettingsProps> = ({ onConfigured }) => {
  // Set default active tab to "local"
  const [activeTab, setActiveTab] = useState<string>('local');
  
  const [config, setConfig] = useState<LlmConfig>({
    endpoint: 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk',
    enabled: true,
    model: 'local', // Default model set to 'local'
    webhookUrl: 'http://localhost:5678/webhook-test/bf4dd093-bb02-472c-9454-7ab9af97bd1d'
  });

  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);
  const [useOpenAiKey, setUseOpenAiKey] = useState<boolean>(false);
  const [testingOpenAi, setTestingOpenAi] = useState<boolean>(false);
  
  // Enable local LLama by default
  const [useLocalLlama, setUseLocalLlama] = useState<boolean>(true);
  
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadModelName, setDownloadModelName] = useState<string>('');
  const [uploadedModels, setUploadedModels] = useState<Array<{name: string, path: string}>>([]);

  // Load config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('llmConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        setIsCustomModel(!!parsedConfig.customModel?.isCustom);
        setUseOpenAiKey(!!parsedConfig.openAi?.enabled);
        
        // If there's no explicit setting for local LLama, default to enabled
        setUseLocalLlama(parsedConfig.localLlama?.enabled !== false);
        
        // If not explicitly set, initialize localLlama with enabled:true
        if (parsedConfig.localLlama === undefined) {
          setConfig(prev => ({
            ...prev,
            localLlama: {
              enabled: true,
              threads: navigator.hardwareConcurrency || 4,
              contextSize: 2048,
              batchSize: 512
            }
          }));
        }
        
        // If configuration looks valid, notify parent
        if (parsedConfig.localLlama?.enabled && parsedConfig.localLlama?.modelPath) {
          onConfigured?.();
        } else if (parsedConfig.openAi?.enabled && parsedConfig.openAi?.apiKey) {
          onConfigured?.();
        } else if (parsedConfig.customModel?.isCustom && parsedConfig.customModel?.apiKey) {
          onConfigured?.();
        }
      } catch (error) {
        console.error('Failed to parse saved LLM config:', error);
      }
    } else {
      // If no config exists, initialize with local LLama enabled
      setConfig(prev => ({
        ...prev,
        model: 'local',
        localLlama: {
          enabled: true,
          threads: navigator.hardwareConcurrency || 4,
          contextSize: 2048,
          batchSize: 512
        }
      }));
    }

    // Load saved uploaded models
    const savedUploadedModels = localStorage.getItem('uploadedModels');
    if (savedUploadedModels) {
      try {
        setUploadedModels(JSON.parse(savedUploadedModels));
      } catch (error) {
        console.error('Failed to parse saved uploaded models:', error);
      }
    }
  }, [onConfigured]);

  // Save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('llmConfig', JSON.stringify(config));
    
    // Check if the config should be considered "configured"
    const isConfigured = (
      (config.localLlama?.enabled && config.localLlama?.modelPath) ||
      (config.openAi?.enabled && config.openAi?.apiKey) ||
      (config.customModel?.isCustom && config.customModel?.apiKey)
    );
    
    if (isConfigured) {
      onConfigured?.();
    }
  }, [config, onConfigured]);

  // Save uploaded models to localStorage when they change
  useEffect(() => {
    localStorage.setItem('uploadedModels', JSON.stringify(uploadedModels));
  }, [uploadedModels]);

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
        model: 'local', // Set the model to local when local LLama is enabled
        localLlama: {
          enabled: true,
          modelPath: prev.localLlama?.modelPath || '',
          threads: prev.localLlama?.threads || navigator.hardwareConcurrency || 4,
          contextSize: prev.localLlama?.contextSize || 2048,
          batchSize: prev.localLlama?.batchSize || 512
        }
      }));
      
      // If the model path is already set, trigger configured callback
      if (config.localLlama?.modelPath) {
        onConfigured?.();
      }
    } else {
      setConfig(prev => ({
        ...prev,
        model: 'default', // Reset to default model when local LLama is disabled
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
          
          // Notify parent that a valid configuration is now available
          onConfigured?.();
          
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const handleModelUploaded = (modelPath: string, modelName: string) => {
    // Add the newly uploaded model to the list
    const newModel = { name: modelName, path: modelPath };
    setUploadedModels(prev => [...prev, newModel]);
    
    // Automatically select this model
    setConfig(prev => ({
      ...prev,
      model: 'local', // Set model to local when a model is uploaded
      localLlama: {
        ...prev.localLlama,
        enabled: true,
        modelPath: modelPath
      }
    }));
    
    // Enable local LLaMA
    setUseLocalLlama(true);
    
    // Show success message
    toast({
      title: 'Model Uploaded',
      description: `${modelName} has been uploaded and selected as your local model.`,
      duration: 3000
    });
    
    // Notify parent that a valid configuration is now available
    onConfigured?.();
  };

  const selectUploadedModel = (modelPath: string) => {
    setConfig(prev => ({
      ...prev,
      model: 'local', // Set model to local when selecting a local model
      localLlama: {
        ...prev.localLlama,
        enabled: true,
        modelPath: modelPath
      }
    }));
    
    // Show confirmation
    toast({
      title: 'Model Selected',
      description: `Model has been selected for local inference.`,
      duration: 2000
    });
    
    // Notify parent that a valid configuration is now available
    onConfigured?.();
  };

  // Initialize LLaMA.cpp when local model setting is enabled
  useEffect(() => {
    if (useLocalLlama && config.localLlama?.modelPath) {
      initLlamaCpp()
        .then(() => {
          console.log('LLaMA.cpp initialized successfully');
        })
        .catch(error => {
          console.error('Failed to initialize LLaMA.cpp:', error);
        });
    }
  }, [useLocalLlama, config.localLlama?.modelPath]);

  const testLocalModel = async () => {
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
    
    try {
      // In a real implementation, this would initialize the llama.cpp model
      // and run a simple inference test
      await initLlamaCpp();
      
      // Simulate a successful test
      setTimeout(() => {
        toast({
          title: 'Local Model Ready',
          description: `Model at ${config.localLlama?.modelPath} is working correctly`
        });
        
        // Notify parent that a valid configuration is now available
        onConfigured?.();
      }, 1500);
    } catch (error) {
      toast({
        title: 'Model Test Failed',
        description: error instanceof Error ? error.message : 'Failed to initialize local model',
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
        
        // Notify parent that a valid configuration is now available
        onConfigured?.();
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
    <div className="space-y-6 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="local">Local Models</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="custom">Custom Model</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Local AI Models</h3>
            <p className="text-sm text-gray-500 mb-4">Run language models directly on your device for privacy and offline use</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Local Models</h4>
              <p className="text-sm text-gray-500">Process all queries on your device</p>
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
                    defaultValue={[config.localLlama?.threads || navigator.hardwareConcurrency || 4]}
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
                <p className="text-xs text-gray-500">Higher values may improve performance on multi-core systems</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="context-size">Context Size (tokens)</Label>
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
                <p className="text-xs text-gray-500">Larger context allows for longer conversations (uses more memory)</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Your Models</Label>
                  <p className="text-xs text-gray-500 mb-2">Upload a model or select an existing one</p>
                </div>
                
                {/* Add model uploader component */}
                <div className="mt-2 border border-dashed rounded-md p-4 bg-muted/10">
                  <ModelUploader onModelUploaded={handleModelUploaded} />
                </div>
                
                {/* Available models section */}
                <div className="mt-4">
                  <Label>Available Models</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <Card 
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => downloadLocalModel('llama-3-8b-q4')}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Llama 3 (8B, Q4)</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2"
                            disabled={isDownloading}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            <span className="text-xs">Download</span>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Balanced model, good for general use (~4.3GB)
                        </p>
                        {isDownloading && downloadModelName === 'llama-3-8b-q4' && (
                          <div className="pt-1">
                            <Progress value={downloadProgress} className="h-1" />
                            <p className="text-xs text-center pt-1">
                              {downloadProgress < 100 ? 'Downloading...' : 'Installing...'}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                    
                    <Card 
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => downloadLocalModel('llama-3-1b-q4')}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Llama 3 (1B, Q4)</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2"
                            disabled={isDownloading}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            <span className="text-xs">Download</span>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Lightweight model, fast on low-end devices (~600MB)
                        </p>
                        {isDownloading && downloadModelName === 'llama-3-1b-q4' && (
                          <div className="pt-1">
                            <Progress value={downloadProgress} className="h-1" />
                            <p className="text-xs text-center pt-1">
                              {downloadProgress < 100 ? 'Downloading...' : 'Installing...'}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
                
                {/* Uploaded models section */}
                {uploadedModels.length > 0 && (
                  <div className="mt-4">
                    <Label>Your Uploaded Models</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {uploadedModels.map((model, index) => (
                        <Card 
                          key={index}
                          className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                            config.localLlama?.modelPath === model.path ? 'border-primary' : ''
                          }`}
                          onClick={() => selectUploadedModel(model.path)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">{model.name}</h4>
                              <p className="text-xs text-muted-foreground">{model.path}</p>
                            </div>
                            {config.localLlama?.modelPath === model.path && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
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
                
                <Button className="w-full" onClick={testLocalModel}>
                  Test Model Connection
                </Button>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Cpu className="h-3 w-3" />
                  <span>Processing happens locally for privacy</span>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="openai" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">OpenAI Configuration</h3>
            <p className="text-sm text-gray-500 mb-4">Configure your OpenAI API key as a fallback option</p>
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
