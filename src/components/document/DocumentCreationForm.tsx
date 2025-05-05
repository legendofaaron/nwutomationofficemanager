
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DocumentNameAiSuggestion from './DocumentNameAiSuggestion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DocumentCreationFormProps {
  documentName: string;
  documentType: string;
  onNameChange: (name: string) => void;
  onTypeChange: (type: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSkip: () => void;
}

const DocumentCreationForm = ({
  documentName,
  documentType,
  onNameChange,
  onTypeChange,
  onSubmit,
  onSkip,
}: DocumentCreationFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="documentName">Document Name</Label>
          <DocumentNameAiSuggestion onSuggestion={onNameChange} />
        </div>
        <Input
          id="documentName"
          placeholder="Enter document name (or skip to use default)"
          value={documentName}
          onChange={(e) => onNameChange(e.target.value)}
          className="col-span-3"
          autoFocus
        />
      </div>
      
      <div className="space-y-2">
        <Label>Document Template</Label>
        <RadioGroup 
          value={documentType} 
          onValueChange={onTypeChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blank" id="blank" />
            <Label htmlFor="blank" className="cursor-pointer">Blank Document</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="report" id="report" />
            <Label htmlFor="report" className="cursor-pointer">Report Template</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="meeting" id="meeting" />
            <Label htmlFor="meeting" className="cursor-pointer">Meeting Notes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="project" id="project" />
            <Label htmlFor="project" className="cursor-pointer">Project Plan</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" type="button" onClick={onSkip}>
          Skip
        </Button>
        <Button type="submit">Create Document</Button>
      </div>
    </form>
  );
};

export default DocumentCreationForm;
