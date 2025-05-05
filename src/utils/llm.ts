
import { LlmConfig } from '@/components/LlmSettings';

interface LlmResponse {
  message: string;
}

export async function queryLlm(prompt: string, endpoint: string, model: string = 'default', webhookUrl?: string): Promise<LlmResponse> {
  try {
    // Get webhook URL from localStorage if not provided explicitly
    const storedConfig = localStorage.getItem('llmConfig');
    const config = storedConfig ? JSON.parse(storedConfig) : {};
    const effectiveWebhookUrl = webhookUrl || config.webhookUrl;
    
    const payload: Record<string, any> = {
      message: prompt,
      model: model
    };
    
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
      throw new Error('Failed to query n8n workflow');
    }

    const data = await response.json();
    return {
      message: data.response || data.message || "No response received",
    };
  } catch (error) {
    console.error('Error querying n8n workflow:', error);
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
