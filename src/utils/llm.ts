
import { LlmConfig } from '@/components/LlmSettings';

interface LlmResponse {
  message: string;
}

export async function queryLlm(prompt: string, endpoint: string, model: string = 'default', webhookUrl?: string): Promise<LlmResponse> {
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

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to query language model');
    }

    const data = await response.json();
    return {
      message: data.response || data.message || "No response received",
    };
  } catch (error) {
    console.error('Error querying language model:', error);
    throw error;
  }
}

// New function to query OpenAI API directly
async function queryOpenAi(prompt: string, model: string, apiKey: string): Promise<LlmResponse> {
  try {
    // Map our model names to OpenAI model names if needed
    const openAiModel = model === 'default' ? 'gpt-4o-mini' : model;
    
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
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to query OpenAI');
    }
    
    const data = await response.json();
    return {
      message: data.choices[0]?.message?.content || "No response received from OpenAI"
    };
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    throw error;
  }
}

export async function sendWebhookNotification(message: string, webhookUrl: string): Promise<boolean> {
  if (!webhookUrl) {
    console.error('Missing webhook URL');
    return false;
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
        source: 'chat-ui'
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error sending webhook notification:', error);
    return false;
  }
}
