
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, Plus, Upload } from 'lucide-react';

interface EmptyKnowledgeStateProps {
  onAddClick: () => void;
  onUploadClick: () => void;
}

export const EmptyKnowledgeState: React.FC<EmptyKnowledgeStateProps> = ({ onAddClick, onUploadClick }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="rounded-full bg-primary/10 p-3 mb-4">
      <Book className="h-6 w-6 text-primary" />
    </div>
    <h3 className="font-medium text-lg mb-2">No Knowledge Items</h3>
    <p className="text-muted-foreground max-w-md mb-6">
      Your knowledge base is empty. Add documents, data, or other information to train your AI assistant.
    </p>
    <div className="flex gap-3">
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add Knowledge
      </Button>
      <Button variant="outline" onClick={onUploadClick}>
        <Upload className="h-4 w-4 mr-2" />
        Upload Files
      </Button>
    </div>
  </div>
);
