
import { LlmConfig } from '@/components/LlmSettings';

interface LlmResponse {
  message: string;
}

export async function queryLlm(prompt: string, endpoint: string, model: string = 'default'): Promise<LlmResponse> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        model: model
      }),
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
