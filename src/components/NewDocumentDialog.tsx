
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { cn } from '@/lib/utils';
import DocumentCreationForm from './document/DocumentCreationForm';

interface NewDocumentDialogProps {
  className?: string;
}

const NewDocumentDialog = ({ className }: NewDocumentDialogProps) => {
  const { setFiles, files, setCurrentFile, setViewMode } = useAppContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [documentName, setDocumentName] = React.useState("");

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" 
          size="sm"
          className={cn("w-full justify-start hover:bg-sidebar-accent", className)}
          onClick={() => {
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
        <DocumentCreationForm
          documentName={documentName}
          onNameChange={setDocumentName}
          onSubmit={handleCreateDocument}
          onSkip={() => createDocument()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewDocumentDialog;
