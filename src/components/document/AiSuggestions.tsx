
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { queryLlm } from '@/utils/llm';
import { useToast } from '@/hooks/use-toast';

interface AiSuggestionsProps {
  content: string;
  onSuggestionApply: (suggestion: string) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({ content, onSuggestionApply }) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const prompt = `Please suggest improvements for this text: ${content}`;
      
      // Load LLM configuration from localStorage
      const storedConfig = localStorage.getItem('llmConfig');
      const config = storedConfig ? JSON.parse(storedConfig) : {};
      const endpoint = config.endpoint || 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk';
      const model = config.customModel?.isCustom ? 'custom' : (config.model || 'default');
      
      // Pass webhook URL as undefined to let queryLlm use the one from localStorage
      const response = await queryLlm(prompt, endpoint, model);
      onSuggestionApply(response.message);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 top-32 z-10">
      <Button
        onClick={generateSuggestions}
        variant="outline"
        className="bg-white shadow-sm"
        disabled={loading || !content.trim()}
      >
        <Bot className="mr-2 h-4 w-4" />
        {loading ? 'Generating...' : 'Get AI Suggestions'}
      </Button>
    </div>
  );
};

export default AiSuggestions;
