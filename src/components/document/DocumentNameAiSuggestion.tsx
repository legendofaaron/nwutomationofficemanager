
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
      
      // Use a timeout to handle potential connection issues
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out")), 5000)
      );
      
      const responsePromise = queryLlm(prompt, 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk');
      const response = await Promise.race([responsePromise, timeoutPromise]) as any;
      
      if (response && response.message) {
        onSuggestion(response.message.trim());
      } else {
        // Fallback to a generic suggestion if no message
        onSuggestion("Project Document " + new Date().toISOString().slice(0, 10));
      }
    } catch (error) {
      console.error("AI suggestion failed:", error);
      // Provide a fallback suggestion
      const fallbackNames = [
        "Strategic Overview",
        "Quarterly Report",
        "Project Proposal",
        "Meeting Minutes",
        "Action Plan"
      ];
      const randomName = fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
      onSuggestion(randomName);
      
      toast({
        title: "Using offline suggestion",
        description: "Could not connect to AI service. Using a generated name instead.",
        variant: "default",
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
            <MessageCircle className={cn("h-4 w-4", isLoading && "animate-pulse")} />
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
