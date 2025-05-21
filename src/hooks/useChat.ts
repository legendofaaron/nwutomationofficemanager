
import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/components/chat/MessageBubble';
import { sendMessage, isDocumentContentRequest, generateDocument } from '@/components/chat/ChatService';
import { toast } from '@/hooks/use-toast';
import { isLlmConfigured } from '@/utils/modelConfig';

interface UseChatOptions {
  assistantName?: string;
  assistantPurpose?: string;
  companyName?: string;
  onDocumentGenerated?: (content: string, documentName?: string) => void;
  checkPremiumAccess?: (feature: string) => boolean;
}

export function useChat({
  assistantName = 'Assistant',
  assistantPurpose = 'help with tasks',
  companyName = '',
  onDocumentGenerated,
  checkPremiumAccess
}: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelConfigured, setIsModelConfigured] = useState(false);
  
  // Check if model is configured
  useEffect(() => {
    setIsModelConfigured(isLlmConfigured());
  }, []);
  
  // Handle sending a message
  const handleSendMessage = useCallback(async (input: string) => {
    // For premium features, check access
    if (checkPremiumAccess && 
        (input.toLowerCase().includes('customize') || 
         input.toLowerCase().includes('advanced') || 
         input.toLowerCase().includes('train') || 
         isDocumentContentRequest(input))) {
      if (!checkPremiumAccess('Advanced AI Features')) return;
    }
    
    if (isLoading || !isModelConfigured) return;
    
    const userMessageId = Date.now().toString();
    const userMessage = { id: userMessageId, type: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      // Check if the request is for document content generation
      if (isDocumentContentRequest(input) && onDocumentGenerated) {
        // Generate document content
        const documentContent = await generateDocument(input, "general");
        
        // Pass generated content to callback
        onDocumentGenerated(documentContent);
        
        // Add a response about the document creation
        const responseMessage = await sendMessage(
          "I've just created a document based on the user's request. Tell them it's ready.",
          messages,
          { assistantName, companyName }
        );
        
        setMessages(prev => [...prev, responseMessage]);
      } else {
        // Handle regular chat messages
        const responseMessage = await sendMessage(
          input, 
          messages,
          { assistantName, companyName }
        );
        
        setMessages(prev => [...prev, responseMessage]);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          type: 'ai', 
          content: "I'm unable to process your request. Please check your configuration."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isModelConfigured, messages, assistantName, companyName, onDocumentGenerated, checkPremiumAccess]);
  
  // Handle quick action
  const handleQuickAction = useCallback(async (action: string) => {
    // Reuse the same message handling logic
    await handleSendMessage(action);
  }, [handleSendMessage]);
  
  return {
    messages,
    isLoading,
    isModelConfigured,
    sendMessage: handleSendMessage,
    quickAction: handleQuickAction
  };
}
