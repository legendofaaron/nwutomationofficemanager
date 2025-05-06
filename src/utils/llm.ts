
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
  if (model === 'local' || (config.localLlama?.enabled && config.localLlama?.modelPath)) {
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
    
    console.log('Local LLaMa inference:', {
      modelPath: llamaConfig.modelPath,
      threads: llamaConfig.threads,
      contextSize: llamaConfig.contextSize,
      batchSize: llamaConfig.batchSize,
      prompt,
      systemPrompt
    });
    
    // Simulate inference time based on complexity and model size
    const modelSizeFactor = llamaConfig.modelPath.includes('1b') ? 0.6 : 
                            llamaConfig.modelPath.includes('3b') ? 1.0 : 1.5;
    
    const baseTime = 500; // Base response time in milliseconds
    const complexityFactor = prompt.length / 20; // Longer prompts take more time
    const threadFactor = Math.max(1, 16 / (llamaConfig.threads || 4)); // More threads = faster processing
    
    const responseTime = Math.min(
      baseTime + 
      (modelSizeFactor * 800) + 
      (complexityFactor * modelSizeFactor * 10) * 
      threadFactor, 
      5000 // Cap at 5 seconds max
    );
    
    // Prepare the complete prompt with system prompt if provided
    let fullPrompt = prompt;
    if (systemPrompt) {
      fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\nAssistant:`;
    }
    
    // Create a more realistic streaming experience by returning chunks of the response
    let fullResponse = '';
    const streamingUpdates = 8; // Number of updates to simulate streaming
    
    if (systemPrompt?.includes('document writer')) {
      // For document generation - create a document response
      fullResponse = generateDocumentResponse(prompt);
    } else {
      // For regular chat - create a conversational response
      fullResponse = generateConversationResponse(prompt, llamaConfig);
    }
    
    // Simulate the streaming process
    const chunkSize = Math.ceil(fullResponse.length / streamingUpdates);
    for (let i = 0; i < streamingUpdates; i++) {
      await new Promise(resolve => setTimeout(
        resolve, 
        responseTime / streamingUpdates
      ));
      
      // In a real implementation, this would stream tokens to the UI
      const partialResponse = fullResponse.slice(0, (i + 1) * chunkSize);
      console.log(`Streaming chunk ${i + 1}/${streamingUpdates}: ${partialResponse.slice(-50)}`);
    }
    
    return {
      message: fullResponse,
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
 * Generate a document response for document-related prompts
 */
function generateDocumentResponse(prompt: string): string {
  // Create a document-styled response
  return `# Response to: ${prompt}\n\n## Introduction\n\nThis document addresses the prompt you've provided. Let's explore the topic in detail.\n\n## Analysis\n\nThe key points to consider are:\n- First important consideration related to "${prompt.slice(0, 30)}..."\n- Second important consideration regarding implementation approach\n- Third important consideration about technical feasibility\n\n## Implementation Strategy\n\nBased on the requirements, we recommend the following approach:\n\n1. Start with a proof-of-concept implementation\n2. Validate with key stakeholders\n3. Implement the core functionality\n4. Test thoroughly before deployment\n\n## Technical Considerations\n\n- Performance optimization for large datasets\n- Security considerations for user data\n- Scalability planning for future growth\n\n## Conclusion\n\nThe proposed solution addresses the requirements while maintaining flexibility for future enhancements. Recommend proceeding with implementation following the outlined approach.`;
}

/**
 * Generate a conversation response for chat-related prompts
 */
function generateConversationResponse(prompt: string, config: any): string {
  // Identify potential topic areas in the prompt
  const isTechnical = /code|program|develop|bug|error|function|api|database|algorithm/i.test(prompt);
  const isQuestion = /how|what|why|where|when|who|can|should|could|would|will|is|are|do/i.test(prompt);
  const isGreeting = /hello|hi|hey|good morning|good afternoon|good evening/i.test(prompt);
  
  // Generate a response based on the identified characteristics
  if (isGreeting) {
    return `Hello! I'm running on a local LLaMa model (${config.modelPath.split('/').pop()}) with ${config.threads} threads. How can I assist you today?`;
  } else if (isTechnical) {
    return `I've analyzed your technical question about "${prompt.slice(0, 30)}..."\n\nBased on my understanding, here's my response:\n\nThis is being processed using a local LLaMa model with ${config.threads} CPU threads and ${config.contextSize} context window. The local inference approach provides better privacy and can work offline, though it may not have the same capabilities as larger cloud-based models.\n\nRegarding your specific question, I'd recommend focusing on best practices for implementation and considering the trade-offs between different approaches. Testing thoroughly will be important to ensure reliability.`;
  } else if (isQuestion) {
    return `Thanks for your question about "${prompt.slice(0, 30)}..."\n\nHere's what I can tell you:\n\nYour question is being processed locally on your device using LLaMa.cpp, configured with ${config.threads} threads and ${config.contextSize} token context length. Local inference provides privacy advantages and works offline, though it may have some limitations compared to cloud APIs.\n\nI hope this information helps with your query! Let me know if you need any clarification.`;
  } else {
    return `I processed your message using local LLaMa inference with the following parameters:\n- Model: ${config.modelPath.split('/').pop()}\n- Threads: ${config.threads}\n- Context size: ${config.contextSize} tokens\n- Batch size: ${config.batchSize}\n\nLocal inference provides privacy and works offline. Your message has been analyzed, and I'm providing this response based on the local model's capabilities. This simulated response demonstrates how the local inference would work in a fully implemented system.`;
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
