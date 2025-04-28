
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus, MessageCircle } from "lucide-react";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { queryLlm } from '@/utils/llm';
import { toast } from '@/hooks/use-toast';

interface NewDocumentDialogProps {
  className?: string;
}

const NewDocumentDialog = ({ className }: NewDocumentDialogProps) => {
  const { setFiles, files, setCurrentFile, setViewMode } = useAppContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [documentName, setDocumentName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const createDocument = (name: string = "New Document") => {
    const finalName = name.trim() || "New Document";
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: finalName,
      type: "document" as const,
      content: `# ${finalName}\n\nStart writing here...`
    };

    setFiles([...files, newDoc]);
    setCurrentFile(newDoc);
    setViewMode('document');
    setIsOpen(false);
    setDocumentName("");
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    createDocument(documentName);
  };

  const handleGetAiSuggestion = async () => {
    try {
      setIsLoading(true);
      const prompt = "Suggest a creative and professional name for a new document. Return only the name, no explanations.";
      const response = await queryLlm(prompt, 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk');
      if (response.message) {
        setDocumentName(response.message.trim());
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" 
          size="sm"
          className={cn("w-full justify-start hover:bg-sidebar-accent", className)}
          onClick={() => {
            // If user just clicks the button without wanting to name the document
            if (!isOpen) {
              createDocument();
            }
          }}
        >
          <FilePlus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateDocument} className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="documentName">Document Name (Optional)</Label>
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
            </div>
            <Input
              id="documentName"
              placeholder="Enter document name (optional)"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => createDocument()}>
              Skip
            </Button>
            <Button type="submit">Create Document</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewDocumentDialog;
