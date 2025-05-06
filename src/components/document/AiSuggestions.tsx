
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles } from 'lucide-react';
import { queryLlm } from '@/utils/llm';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';

interface AiSuggestionsProps {
  content: string;
  onSuggestionApply: (suggestion: string) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({
  content,
  onSuggestionApply
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const { checkAccess, PremiumFeatureGate } = usePremiumFeature();

  const generateSuggestions = async () => {
    if (!checkAccess('AI Suggestions')) return;
    
    setLoading(true);
    try {
      const prompt = `Please suggest improvements for this text: ${content}`;

      // Load LLM configuration from localStorage
      const storedConfig = localStorage.getItem('llmConfig');
      const config = storedConfig ? JSON.parse(storedConfig) : {};
      const endpoint = config.endpoint || 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk';
      const model = config.customModel?.isCustom ? 'custom' : config.model || 'default';

      // Pass webhook URL as undefined to let queryLlm use the one from localStorage
      const response = await queryLlm(prompt, endpoint, model);
      onSuggestionApply(response.message);
      
      toast({
        title: "AI Suggestions Applied",
        description: "The document has been enhanced with AI suggestions.",
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate suggestions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed right-4 top-32 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full shadow-md bg-white hover:bg-gray-100 border border-gray-200"
                onClick={generateSuggestions}
                disabled={loading}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
                ) : (
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Enhance with AI suggestions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <PremiumFeatureGate />
    </>
  );
};

export default AiSuggestions;
