
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DocumentNameAiSuggestion from './DocumentNameAiSuggestion';

interface DocumentCreationFormProps {
  documentName: string;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSkip: () => void;
}

const DocumentCreationForm = ({
  documentName,
  onNameChange,
  onSubmit,
  onSkip,
}: DocumentCreationFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="documentName">Document Name (Optional)</Label>
          <DocumentNameAiSuggestion onSuggestion={onNameChange} />
        </div>
        <Input
          id="documentName"
          placeholder="Enter document name (optional)"
          value={documentName}
          onChange={(e) => onNameChange(e.target.value)}
          className="col-span-3"
          autoFocus
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onSkip}>
          Skip
        </Button>
        <Button type="submit">Create Document</Button>
      </div>
    </form>
  );
};

export default DocumentCreationForm;
