
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus } from "lucide-react";
import { cn } from '@/lib/utils';

interface NewDocumentDialogProps {
  className?: string;
}

const NewDocumentDialog = ({ className }: NewDocumentDialogProps) => {
  const { setFiles, files, setCurrentFile, setViewMode } = useAppContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [documentName, setDocumentName] = React.useState("");

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: documentName.trim() || "New Document",
      type: "document" as const,
      content: `# ${documentName.trim() || "New Document"}\n\nStart writing here...`
    };

    setFiles([...files, newDoc]);
    setCurrentFile(newDoc);
    setViewMode('document');
    setIsOpen(false);
    setDocumentName("");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateDocument} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              placeholder="Enter document name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Document</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewDocumentDialog;
