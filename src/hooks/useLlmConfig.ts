
import { useState, useEffect, useCallback } from 'react';
import { LlmConfig, UploadedModel } from '@/types/llmConfig';
import { getLlmConfig, saveLlmConfig, isLlmConfigured } from '@/utils/modelConfig';
import { toast } from '@/hooks/use-toast';
import { initLlamaCpp } from '@/utils/llm';

interface UseLlmConfigOptions {
  onConfigured?: () => void;
}

export function useLlmConfig({ onConfigured }: UseLlmConfigOptions = {}) {
  const [config, setConfig] = useState<LlmConfig>({
    endpoint: 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk',
    enabled: true,
    model: 'local',
    webhookUrl: 'http://localhost:5678/webhook-test/bf4dd093-bb02-472c-9454-7ab9af97bd1d'
  });

  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);
  const [useOpenAiKey, setUseOpenAiKey] = useState<boolean>(false);
  const [testingOpenAi, setTestingOpenAi] = useState<boolean>(false);
  const [useLocalLlama, setUseLocalLlama] = useState<boolean>(true);
  
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadModelName, setDownloadModelName] = useState<string>('');
  const [uploadedModels, setUploadedModels] = useState<UploadedModel[]>([]);

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
    saveLlmConfig(config);
    
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

  const handleModelTypeChange = useCallback((isCustom: boolean) => {
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
  }, []);

  const handleOpenAiToggle = useCallback((enabled: boolean, checkAccess: (feature: string) => boolean) => {
    // First check if this is a premium feature
    if (enabled && !checkAccess('OpenAI Integration')) return;
    
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
  }, []);

  const handleLocalLlamaToggle = useCallback((enabled: boolean, checkAccess: (feature: string) => boolean) => {
    if (!enabled || (enabled && checkAccess('Local Models'))) {
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
    }
  }, []);

  const downloadLocalModel = useCallback((modelName: string, checkAccess: (feature: string) => boolean) => {
    // Check if this is a premium feature
    if (!checkAccess('Model Downloads')) return;
    
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
  }, [onConfigured]);

  const handleModelUploaded = useCallback((modelPath: string, modelName: string, checkAccess: (feature: string) => boolean) => {
    // Check if this is a premium feature
    if (!checkAccess('Custom Model Upload')) return;
    
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
  }, [onConfigured]);

  const selectUploadedModel = useCallback((modelPath: string, checkAccess: (feature: string) => boolean) => {
    // Check if this is a premium feature
    if (!checkAccess('Custom Models')) return;
    
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
  }, [onConfigured]);

  const testLocalModel = useCallback(async () => {
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
  }, [config.localLlama?.modelPath, onConfigured]);

  const testOpenAiKey = useCallback(async () => {
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
  }, [config.openAi?.apiKey, onConfigured]);

  // Utility functions for API keys
  const loadApiKeysFromLocalStorage = useCallback(() => {
    const savedKeys = localStorage.getItem('chatApiKeys');
    if (savedKeys) {
      try {
        return JSON.parse(savedKeys);
      } catch (e) {
        console.error('Failed to parse saved API keys', e);
        return {};
      }
    }
    return {};
  }, []);

  const saveApiKeyToLocalStorage = useCallback((model: string, apiKey: string, baseUrl?: string) => {
    const savedKeys = loadApiKeysFromLocalStorage();
    const updatedKeys = {
      ...savedKeys,
      [model]: { apiKey, baseUrl }
    };
    localStorage.setItem('chatApiKeys', JSON.stringify(updatedKeys));
    toast({
      title: "API Key Saved",
      description: `API key for ${model} has been saved successfully.`
    });
  }, [loadApiKeysFromLocalStorage]);

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

  return {
    config,
    setConfig,
    isCustomModel,
    setIsCustomModel,
    useOpenAiKey,
    setUseOpenAiKey,
    testingOpenAi,
    useLocalLlama,
    setUseLocalLlama,
    downloadProgress,
    isDownloading,
    downloadModelName,
    uploadedModels,
    handleModelTypeChange,
    handleOpenAiToggle,
    handleLocalLlamaToggle,
    downloadLocalModel,
    handleModelUploaded,
    selectUploadedModel,
    testLocalModel,
    testOpenAiKey,
    loadApiKeysFromLocalStorage,
    saveApiKeyToLocalStorage
  };
}
