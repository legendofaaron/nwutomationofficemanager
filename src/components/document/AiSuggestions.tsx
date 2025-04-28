
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, FileText } from 'lucide-react';
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
      const response = await queryLlm(prompt, 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk');
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
