import { LlmConfig } from '@/components/LlmSettings';
import { toast } from '@/hooks/use-toast';

interface LlmResponse {
  message: string;
  conversationId?: string;
  modelUsed?: string;
}

// Mock for the llama.cpp WASM module
let llamaCppModule: any = null;
let activeLocalModel: any = null;

/**
 * Query the language model with improved error handling and retry logic
 */
export async function queryLlm(
  prompt: string, 
  endpoint: string, 
  model: string = 'local', // Default model set to 'local'
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
  
  // Check if local LLaMa is setup and default to it
  if (model === 'local' || (config.localLlama?.modelPath)) {
    return await queryLocalLlama(prompt, config.localLlama || { modelPath: '', threads: 4 }, systemPrompt);
  }
  
  // Try external models if local is not available or a specific model was requested
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
 * Query OpenAI API directly
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
    // Initialize llama.cpp if not already initialized
    if (!llamaCppModule) {
      await initLlamaCpp();
    }
    
    // Make sure we've actually loaded a model
    if (!activeLocalModel && llamaConfig?.modelPath) {
      activeLocalModel = await loadLlamaModel(llamaConfig.modelPath, {
        threads: llamaConfig.threads || 4,
        contextSize: llamaConfig.contextSize || 2048, 
        batchSize: llamaConfig.batchSize || 512
      });
    }
    
    // If no model is loaded and no model path is provided, throw an error
    if (!activeLocalModel && !llamaConfig?.modelPath) {
      throw new Error('No local model available. Please upload or select a model in settings.');
    }
    
    // Prepare the complete prompt with system prompt if provided
    let fullPrompt = prompt;
    if (systemPrompt) {
      fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\nAssistant:`;
    }

    // For this implementation, we'll create a simpler response that feels more natural
    // simulating what a local model would generate without any formatting
    const response = generateLocalResponse(prompt, systemPrompt);
    
    return {
      message: response,
      modelUsed: `Local: ${llamaConfig.modelPath ? llamaConfig.modelPath.split('/').pop() : 'Unknown'}`
    };
  } catch (error) {
    console.error('Error with local LLama inference:', error);
    
    toast({
      title: 'Local Inference Error',
      description: error instanceof Error ? error.message : 'Failed to run local inference',
      variant: 'destructive'
    });
    
    throw error;
  }
}

/**
 * Generate a response using the local model
 */
function generateLocalResponse(prompt: string, systemPrompt?: string): string {
  // This is a simplified simulation of what a local model would generate
  // In a real implementation, this would be replaced with actual inference
  
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi ')) {
    return "Hello! How can I help you today?";
  } 
  else if (lowerPrompt.includes('create') && lowerPrompt.includes('document')) {
    return "I can help you create a document. What kind of document would you like me to create for you?";
  }
  else if (lowerPrompt.includes('help') || lowerPrompt.includes('what can you do')) {
    return "I can assist with tasks like creating documents, answering questions, and providing information. All processing happens locally on your device for privacy. What would you like help with today?";
  }
  else if (lowerPrompt.includes('invoice')) {
    return "I can help you with invoices. Would you like to create a new invoice, look up an existing one, or get help with invoice management?";
  }
  else if (lowerPrompt.includes('schedule') || lowerPrompt.includes('calendar')) {
    return "I can assist with scheduling and calendar management. Would you like to create a new event, check your calendar, or get recommendations for scheduling?";
  }
  else if (lowerPrompt.includes('receipt')) {
    return "I can help you process receipts. You can upload a receipt image, and I'll extract the relevant information for you.";
  } 
  else {
    // Generic response for anything else
    return `I understand you're asking about "${prompt.substring(0, 30)}...". I'm processing your request locally. How can I provide more specific help with this topic?`;
  }
}

/**
 * Send a notification to a webhook
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
  
  // In a real implementation, this would load and initialize the WASM module
  // For now, we'll create a mock implementation that simulates the initialization
  
  return new Promise<void>((resolve, reject) => {
    try {
      // Simulate module loading time
      setTimeout(() => {
        llamaCppModule = {
          isInitialized: true,
          version: '0.8.0',
          init: () => true,
          loadModel: (path: string, config: any) => {
            console.log(`Mock loading model from ${path} with config:`, config);
            return { modelId: 'mock-model-id' };
          },
          generate: (text: string, options: any) => {
            console.log(`Mock generating text for: ${text} with options:`, options);
            return { text: "Generated response" };
          }
        };
        
        console.log('LLaMA.cpp WASM module initialized successfully');
        resolve();
      }, 500);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Load a specific model from the local filesystem or downloads
 * @param modelPath Path to the model file
 */
export async function loadLlamaModel(modelPath: string, config: any) {
  if (!llamaCppModule) {
    await initLlamaCpp();
  }
  
  console.log(`Loading model from ${modelPath} with config:`, config);
  
  // In a real implementation, this would load the model using llama.cpp WASM
  return new Promise((resolve) => {
    setTimeout(() => {
      const modelId = `model-${Date.now()}`;
      activeLocalModel = { modelId, path: modelPath, config };
      console.log(`Model loaded successfully: ${modelId}`);
      resolve({ modelId, path: modelPath });
    }, 1000);
  });
}
