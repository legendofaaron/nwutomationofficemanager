
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilePlus, Wand2 } from "lucide-react";
import { cn } from '@/lib/utils';
import DocumentCreationForm from './document/DocumentCreationForm';
import { useToast } from '@/hooks/use-toast';
import DocumentGenerator from './document/DocumentGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NewDocumentDialogProps {
  className?: string;
}

const NewDocumentDialog = ({ className }: NewDocumentDialogProps) => {
  const { setFiles, files, setCurrentFile, setViewMode } = useAppContext();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [documentName, setDocumentName] = React.useState("");
  const [documentType, setDocumentType] = React.useState("blank");
  const [activeTab, setActiveTab] = React.useState("basic");

  const getTemplateContent = (type: string, name: string) => {
    switch(type) {
      case "report":
        return `# ${name}\n\n## Executive Summary\n\nProvide a brief overview of the report's purpose and key findings.\n\n## Introduction\n\nDescribe the background and context.\n\n## Key Findings\n\n- Finding 1\n- Finding 2\n- Finding 3\n\n## Recommendations\n\n1. First recommendation\n2. Second recommendation\n\n## Conclusion\n\nSummarize the report and next steps.`;
      case "meeting":
        return `# ${name}\n\n**Date:** ${new Date().toLocaleDateString()}\n**Participants:** [List names]\n\n## Agenda\n\n1. Topic 1\n2. Topic 2\n3. Topic 3\n\n## Discussion Points\n\n### Topic 1\n- Notes\n- Action items\n\n### Topic 2\n- Notes\n- Action items\n\n## Action Items\n\n- [ ] Task 1 (Owner, Due Date)\n- [ ] Task 2 (Owner, Due Date)`;
      case "project":
        return `# ${name}\n\n## Project Overview\n\nDescribe the project's purpose and goals.\n\n## Timeline\n\n- Phase 1: Start Date - End Date\n- Phase 2: Start Date - End Date\n- Phase 3: Start Date - End Date\n\n## Team Members\n\n- Name 1, Role\n- Name 2, Role\n\n## Milestones\n\n- [ ] Milestone 1\n- [ ] Milestone 2\n- [ ] Milestone 3\n\n## Budget\n\n| Category | Allocated | Spent | Remaining |\n|----------|-----------|-------|----------|\n| Category 1 | $0 | $0 | $0 |\n| Category 2 | $0 | $0 | $0 |`;
      default:
        return `# ${name}\n\nStart writing here...`;
    }
  };

  const createDocument = (name: string = "New Document", type: string = "blank") => {
    const finalName = name.trim() || "New Document";
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: finalName,
      type: "document" as const,
      content: getTemplateContent(type, finalName)
    };

    setFiles([...files, newDoc]);
    setCurrentFile(newDoc);
    setViewMode('document');
    setIsOpen(false);
    setDocumentName("");
    setDocumentType("blank");
    
    toast({
      title: "Document created",
      description: `"${finalName}" has been created successfully`,
      duration: 2000,
    });
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    createDocument(documentName, documentType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" 
          size="sm"
          className={cn("w-full justify-start hover:bg-sidebar-accent", className)}
        >
          <FilePlus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="basic">
              Basic Template
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Wand2 className="h-3.5 w-3.5 mr-1.5" />
              AI Document
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <DocumentCreationForm
              documentName={documentName}
              documentType={documentType}
              onNameChange={setDocumentName}
              onTypeChange={setDocumentType}
              onSubmit={handleCreateDocument}
              onSkip={() => createDocument()}
            />
          </TabsContent>
          
          <TabsContent value="ai">
            <DocumentGenerator onClose={() => setIsOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewDocumentDialog;
