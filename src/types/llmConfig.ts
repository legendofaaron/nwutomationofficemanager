
/**
 * Type definitions for LLM configuration
 */

export interface LlmConfig {
  endpoint?: string;
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

export interface UploadedModel {
  name: string;
  path: string;
}
