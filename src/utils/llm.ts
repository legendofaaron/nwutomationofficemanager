
import { LlmConfig } from '@/components/LlmSettings';
import { toast } from '@/hooks/use-toast';

interface LlmResponse {
  message: string;
  conversationId?: string;
  modelUsed?: string;
}

/**
 * Query the language model with improved error handling and retry logic
 */
export async function queryLlm(prompt: string, endpoint: string, model: string = 'default', webhookUrl?: string): Promise<LlmResponse> {
  // Maximum number of retries
  const MAX_RETRIES = 2;
  let retries = 0;
  let lastError: Error | null = null;
  
  while (retries <= MAX_RETRIES) {
    try {
      // Get stored configuration from localStorage
      const storedConfig = localStorage.getItem('llmConfig');
      const config = storedConfig ? JSON.parse(storedConfig) : {};
      const effectiveWebhookUrl = webhookUrl || config.webhookUrl;
      
      // Check if OpenAI integration is enabled
      if (config.openAi?.enabled && config.openAi?.apiKey) {
        return await queryOpenAi(prompt, model, config.openAi.apiKey);
      }
      
      const payload: Record<string, any> = {
        message: prompt,
        model: model
      };
      
      // Include custom model configuration if it exists and is enabled
      if (config.customModel?.isCustom) {
        payload.customModel = {
          name: config.customModel.name,
          apiKey: config.customModel.apiKey,
          baseUrl: config.customModel.baseUrl,
          contextLength: config.customModel.contextLength
        };
      }
      
      // Always include webhook URL if available from any source
      if (effectiveWebhookUrl) {
        payload.webhookUrl = effectiveWebhookUrl;
        payload.callbackEnabled = true;
      }

      // Handle empty or missing endpoint
      if (!endpoint) {
        throw new Error('Missing endpoint configuration');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to query language model: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        message: data.response || data.message || "No response received",
        conversationId: data.conversationId,
        modelUsed: data.model || model
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      console.error(`Error querying language model (attempt ${retries + 1}/${MAX_RETRIES + 1}):`, error);
      
      // If we've reached max retries, throw the error
      if (retries === MAX_RETRIES) {
        console.error('Max retries reached, giving up');
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      retries++;
    }
  }
  
  // This should never be reached due to the throw in the loop,
  // but TypeScript needs it for type safety
  throw lastError || new Error('Failed to query language model after retries');
}

/**
 * Query OpenAI API directly with improved error handling
 */
async function queryOpenAi(prompt: string, model: string, apiKey: string): Promise<LlmResponse> {
  try {
    // Map our model names to OpenAI model names if needed
    const openAiModel = model === 'default' ? 'gpt-4o-mini' : model;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: openAiModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to query OpenAI');
    }
    
    const data = await response.json();
    return {
      message: data.choices[0]?.message?.content || "No response received from OpenAI",
      modelUsed: openAiModel
    };
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    
    // Show an error notification for user feedback
    toast({
      title: 'OpenAI Connection Error',
      description: error instanceof Error ? error.message : 'Failed to connect to OpenAI',
      variant: 'destructive'
    });
    
    throw error;
  }
}

/**
 * Send a notification to a webhook with improved error handling
 */
export async function sendWebhookNotification(message: string, webhookUrl: string): Promise<boolean> {
  if (!webhookUrl) {
    console.error('Missing webhook URL');
    return false;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
        source: 'office-manager-app'
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    return response.ok;
  } catch (error) {
    console.error('Error sending webhook notification:', error);
    return false;
  }
}

/**
 * Get the current LLM configuration
 */
export function getLlmConfig(): any {
  try {
    const storedConfig = localStorage.getItem('llmConfig');
    return storedConfig ? JSON.parse(storedConfig) : null;
  } catch (error) {
    console.error('Error retrieving LLM config:', error);
    return null;
  }
}

/**
 * Check if LLM is properly configured for use
 */
export function isLlmConfigured(): boolean {
  const config = getLlmConfig();
  return !!(config && (
    (config.openAi?.enabled && config.openAi?.apiKey) || 
    (config.customModel?.isCustom && config.customModel?.apiKey)
  ));
}
