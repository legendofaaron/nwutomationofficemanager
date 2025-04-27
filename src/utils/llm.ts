
interface LlmResponse {
  message: string;
}

export async function queryLlm(prompt: string, endpoint: string, model: string): Promise<LlmResponse> {
  try {
    const response = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to query LLM');
    }

    const data = await response.json();
    return {
      message: data.response,
    };
  } catch (error) {
    console.error('Error querying LLM:', error);
    throw error;
  }
}
