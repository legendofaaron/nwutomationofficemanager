
/**
 * Utility functions for managing LLM model configurations
 */
import { LlmConfig } from '@/types/llmConfig';

/**
 * Get stored LLM configuration from localStorage
 */
export function getLlmConfig(): LlmConfig | null {
  const savedConfig = localStorage.getItem('llmConfig');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (error) {
      console.error('Failed to parse saved LLM config:', error);
    }
  }
  return null;
}

/**
 * Save LLM configuration to localStorage
 */
export function saveLlmConfig(config: LlmConfig): void {
  localStorage.setItem('llmConfig', JSON.stringify(config));
}

/**
 * Check if a valid LLM configuration exists
 */
export function isLlmConfigured(): boolean {
  const config = getLlmConfig();
  
  // Check if any valid configuration exists
  return !!(
    (config?.localLlama?.enabled && config.localLlama?.modelPath) ||
    (config?.openAi?.enabled && config?.openAi?.apiKey) ||
    (config?.customModel?.isCustom && config?.customModel?.apiKey)
  );
}

/**
 * Check if a specific model is configured
 */
export function isModelConfigured(modelId: string): boolean {
  // For local models, check LLM configuration
  if (modelId === 'local-llm' || modelId === 'ollama') {
    const config = getLlmConfig();
    return !!(config?.localLlama?.enabled && config?.localLlama?.modelPath);
  }
  
  // For OpenAI models
  if (modelId.startsWith('gpt-')) {
    const config = getLlmConfig();
    return !!(config?.openAi?.enabled && config?.openAi?.apiKey);
  }
  
  // For other models, check saved API keys
  const savedKeys = localStorage.getItem('chatApiKeys');
  if (savedKeys) {
    try {
      const keys = JSON.parse(savedKeys);
      return !!keys[modelId]?.apiKey;
    } catch (e) {
      console.error('Failed to parse saved API keys', e);
    }
  }
  
  return false;
}
