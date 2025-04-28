
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { queryLlm } from '@/utils/llm';
import { toast } from '@/hooks/use-toast';

interface DocumentNameAiSuggestionProps {
  onSuggestion: (name: string) => void;
}

const DocumentNameAiSuggestion = ({ onSuggestion }: DocumentNameAiSuggestionProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGetAiSuggestion = async () => {
    try {
      setIsLoading(true);
      const prompt = "Suggest a creative and professional name for a new document. Return only the name, no explanations.";
      const response = await queryLlm(prompt, 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk');
      if (response.message) {
        onSuggestion(response.message.trim());
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={handleGetAiSuggestion}
            disabled={isLoading}
          >
            <MessageCircle className={cn("h-4 w-4", isLoading && "animate-spin")} />
            <span className="sr-only">AI Help</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Need help naming your document? Click to get AI suggestions</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DocumentNameAiSuggestion;
