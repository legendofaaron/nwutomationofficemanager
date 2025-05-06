
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Save, Download } from "lucide-react";
import GenerateDocumentDialog from './GenerateDocumentDialog';

interface DocumentHeaderProps {
  currentFile: any;
  onNameChange: (name: string) => void;
  onConvertToSpreadsheet?: () => void;
  onSave: () => void;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  currentFile,
  onNameChange,
  onConvertToSpreadsheet,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(currentFile?.name || '');
  
  const handleSave = () => {
    if (onSave) onSave();
  };

  const handleNameChange = () => {
    if (tempName.trim() !== '') {
      onNameChange(tempName);
    } else {
      setTempName(currentFile?.name || '');
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameChange();
    } else if (e.key === 'Escape') {
      setTempName(currentFile?.name || '');
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-background/95 backdrop-blur-sm border-b border-border p-2 z-10 h-14">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-muted-foreground ml-2" />
        
        {isEditing ? (
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameChange}
            onKeyDown={handleKeyDown}
            className="h-8 w-48"
            autoFocus
          />
        ) : (
          <h2 
            className="font-medium text-base hover:bg-accent/80 hover:text-accent-foreground px-2 py-1 rounded cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {currentFile?.name || 'Untitled'}
          </h2>
        )}
      </div>
      
      <div className="flex items-center gap-2 mr-2">
        <GenerateDocumentDialog />
        
        <Button variant="ghost" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1.5" />
          Save
        </Button>
        
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4 mr-1.5" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default DocumentHeader;
