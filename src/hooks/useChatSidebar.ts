
import { useState, useCallback, useEffect } from 'react';

interface ApiKeyConfig {
  apiKey: string;
  baseUrl?: string;
}

export const useChatSidebar = () => {
  const [activeTool, setActiveTool] = useState<string | null>('chat');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');
  const [apiKeys, setApiKeys] = useState<Record<string, ApiKeyConfig>>({});
  
  // Load saved API keys from localStorage on init
  useEffect(() => {
    const savedKeys = localStorage.getItem('chatApiKeys');
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (e) {
        console.error('Failed to parse saved API keys', e);
      }
    }
  }, []);
  
  // Save API keys to localStorage when they change
  useEffect(() => {
    if (Object.keys(apiKeys).length > 0) {
      localStorage.setItem('chatApiKeys', JSON.stringify(apiKeys));
    }
  }, [apiKeys]);

  const handleToolChange = useCallback((tool: string) => {
    setActiveTool(tool);
  }, []);

  const handleModelChange = useCallback((model: string) => {
    setSelectedModel(model);
  }, []);
  
  const saveApiKey = useCallback((model: string, config: ApiKeyConfig) => {
    setApiKeys(prev => ({
      ...prev,
      [model]: config
    }));
  }, []);
  
  const getApiKey = useCallback((model: string) => {
    return apiKeys[model] || null;
  }, [apiKeys]);
  
  const hasApiKey = useCallback((model: string) => {
    return !!apiKeys[model]?.apiKey;
  }, [apiKeys]);

  return {
    activeTool,
    handleToolChange,
    selectedModel,
    handleModelChange,
    saveApiKey,
    getApiKey,
    hasApiKey,
    apiKeys
  };
};
