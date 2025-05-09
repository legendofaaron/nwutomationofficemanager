
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DocumentGenerator from './DocumentGenerator';
import { Wand2 } from 'lucide-react';

interface GenerateDocumentDialogProps {
  triggerClassName?: string;
}

const GenerateDocumentDialog: React.FC<GenerateDocumentDialogProps> = ({ triggerClassName }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="premium"
          size="sm"
          className={triggerClassName}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate AI Document</DialogTitle>
        </DialogHeader>
        <DocumentGenerator onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDocumentDialog;
