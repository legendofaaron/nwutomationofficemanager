
import { queryLlm, generateDocumentContent } from '@/utils/llm';
import { toast } from '@/hooks/use-toast';
import { Message } from './MessageBubble';
import { getLlmConfig } from '@/utils/modelConfig';

// Type definitions
export interface ChatServiceOptions {
  assistantName?: string;
  companyName?: string;
}

/**
 * Handle message sending with LLM
 */
export async function sendMessage(
  input: string,
  messages: Message[],
  options: ChatServiceOptions = {}
): Promise<Message> {
  try {
    // Get stored configuration
    const config = getLlmConfig() || {
      model: 'local',
      localLlama: { enabled: true }
    };
    
    // Create a system context based on assistant configuration
    const systemContext = `You are a local language model assistant${options.companyName ? ` for ${options.companyName}` : ''}. 
    Be concise, helpful, and direct in your responses.`;
    
    // Handle the message with local model
    const responseText = await queryLlm(
      input,
      config.endpoint || '',
      'local',
      undefined,
      systemContext
    );
    
    return { 
      id: Date.now().toString(), 
      type: 'ai', 
      content: responseText.message 
    };
  } catch (error) {
    console.error('Error handling message:', error);
    
    return { 
      id: Date.now().toString(), 
      type: 'ai', 
      content: "I'm unable to process your request. Please check your LLM configuration."
    };
  }
}

/**
 * Check if the request is for document content generation
 */
export function isDocumentContentRequest(message: string): boolean {
  const lowerMsg = message.toLowerCase();
  return (
    (lowerMsg.includes('write') || lowerMsg.includes('create') || lowerMsg.includes('generate')) &&
    (lowerMsg.includes('document') || lowerMsg.includes('content') || lowerMsg.includes('report') || 
     lowerMsg.includes('story') || lowerMsg.includes('article') || lowerMsg.includes('essay'))
  );
}

/**
 * Generate document content
 */
export async function generateDocument(
  input: string,
  documentType: string = "general"
): Promise<string> {
  try {
    // Generate document content
    return await generateDocumentContent(input, documentType);
  } catch (error) {
    console.error('Error generating document:', error);
    toast({
      title: "Document Generation Failed",
      description: "There was an error generating the document content.",
      variant: "destructive"
    });
    return "Unable to generate document content due to an error.";
  }
}
