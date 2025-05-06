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
export async function queryLlm(
  prompt: string, 
  endpoint: string, 
  model: string = 'llama-3.2-3b', 
  webhookUrl?: string,
  systemPrompt?: string
): Promise<LlmResponse> {
  // Maximum number of retries
  const MAX_RETRIES = 2;
  let retries = 0;
  let lastError: Error | null = null;
  
  // Get stored configuration
  const storedConfig = localStorage.getItem('llmConfig');
  const config = storedConfig ? JSON.parse(storedConfig) : {};
  
  // Check if local LLaMa is enabled and should be used
  if (config.localLlama?.enabled) {
    return await queryLocalLlama(prompt, config.localLlama, systemPrompt);
  }
  
  while (retries <= MAX_RETRIES) {
    try {
      const effectiveWebhookUrl = webhookUrl || config.webhookUrl;
      
      // Check if OpenAI integration is enabled
      if (config.openAi?.enabled && config.openAi?.apiKey) {
        return await queryOpenAi(prompt, model, config.openAi.apiKey, systemPrompt);
      }
      
      const payload: Record<string, any> = {
        message: prompt,
        model: model
      };
      
      // Include system prompt if provided
      if (systemPrompt) {
        payload.systemPrompt = systemPrompt;
      }
      
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
 * Query OpenAI API directly with improved error handling and system prompt support
 */
async function queryOpenAi(
  prompt: string, 
  model: string, 
  apiKey: string,
  systemPrompt?: string
): Promise<LlmResponse> {
  try {
    // Map our model names to OpenAI model names if needed
    const openAiModel = model === 'default' ? 'gpt-4o-mini' : model;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    // Create messages array with optional system message
    const messages = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: openAiModel,
        messages: messages,
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
 * Query local LLaMa model using llama.cpp
 */
async function queryLocalLlama(
  prompt: string,
  llamaConfig: any,
  systemPrompt?: string
): Promise<LlmResponse> {
  try {
    // In the real implementation, this would use the llama.cpp WASM module
    // For now, we'll simulate the local inference process
    console.log('Local LLaMa inference:', {
      modelPath: llamaConfig.modelPath,
      threads: llamaConfig.threads,
      contextSize: llamaConfig.contextSize,
      batchSize: llamaConfig.batchSize,
      prompt,
      systemPrompt
    });
    
    // Simulate inference time based on complexity
    const responseTime = Math.min(500 + Math.random() * 1500 + prompt.length / 2, 3000);
    
    // Create a response using a simple template
    // In a real implementation, this would be the actual output from llama.cpp
    await new Promise(resolve => setTimeout(resolve, responseTime));
    
    let response = '';
    if (systemPrompt?.includes('document writer')) {
      // For document generation
      response = `# Response to: ${prompt}\n\n## Introduction\n\nThis document addresses the prompt you've provided. Let's explore the topic in detail.\n\n## Analysis\n\nThe key points to consider are:\n- First important consideration\n- Second important consideration\n- Third important consideration\n\n## Conclusion\n\nBased on the analysis above, we recommend proceeding with a careful implementation approach.`;
    } else {
      // For regular chat
      response = `I analyzed your question about "${prompt.slice(0, 30)}..." using local inference with llama.cpp.\n\nHere's my response based on your request:\n\nThis is a simulated response from a local LLaMa model. In the actual implementation, this would be generated using the llama.cpp library running locally on your device, providing privacy and offline capability. The response would be tailored to your specific query using the model's parameters and knowledge.`;
    }

    return {
      message: response,
      modelUsed: `Local: ${llamaConfig.modelPath.split('/').pop()}`
    };
  } catch (error) {
    console.error('Error with local LLaMa inference:', error);
    
    toast({
      title: 'Local Inference Error',
      description: error instanceof Error ? error.message : 'Failed to run local inference',
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
 * Generate document content based on user request
 */
export async function generateDocumentContent(
  prompt: string,
  documentType: string = 'general'
): Promise<string> {
  try {
    // Get stored configuration
    const storedConfig = localStorage.getItem('llmConfig');
    const config = storedConfig ? JSON.parse(storedConfig) : {};
    
    // Create a system prompt specific to document generation
    const systemPrompt = `You are a professional document writer. 
    Generate a well-structured ${documentType} document based on the user's request.
    Format the output using Markdown syntax with appropriate headings, bullet points, and sections.
    Be concise, clear, and comprehensive. Do not include any explanations or meta-information about the document.
    Just generate the document content directly.`;
    
    // If local LLaMa is enabled, use it for document generation
    if (config.localLlama?.enabled) {
      const response = await queryLocalLlama(prompt, config.localLlama, systemPrompt);
      return response.message;
    }
    
    // Use the existing queryLlm function with document-specific system prompt
    const response = await queryLlm(
      prompt, 
      config.endpoint || '', 
      config.openAi?.enabled ? 'gpt-4o-mini' : 'llama-3.2-3b',
      undefined,
      systemPrompt
    );
    
    return response.message;
  } catch (error) {
    console.error('Error generating document content:', error);
    throw new Error('Failed to generate document content');
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
    (config.customModel?.isCustom && config.customModel?.apiKey) ||
    (config.localLlama?.enabled && config.localLlama?.modelPath)
  ));
}

/**
 * Initialize llama.cpp WASM Module
 */
export function initLlamaCpp() {
  console.log('Initializing llama.cpp WASM module');
  
  // In the real implementation, this would load and initialize the WASM module
  // For example:
  // return import('@/lib/llama.js').then(module => {
  //   return module.init();
  // });
  
  // For now, we'll just return a resolved promise
  return Promise.resolve();
}
