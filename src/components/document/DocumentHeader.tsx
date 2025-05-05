
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, MessageSquare, Save, Check, X as CloseIcon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface DocumentHeaderProps {
  currentFile: any;
  onNameChange: (name: string) => void;
  onConvertToSpreadsheet: () => void;
  onSave?: () => void;
}

const DocumentHeader = ({ currentFile, onNameChange, onConvertToSpreadsheet, onSave }: DocumentHeaderProps) => {
  const { aiAssistantOpen, setAiAssistantOpen } = useAppContext();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(currentFile?.name || '');

  const handleNameSave = () => {
    if (!editedName.trim()) return;
    onNameChange(editedName);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(currentFile?.name || '');
    setIsEditingName(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
      {isEditingName ? (
        <div className="flex items-center gap-2">
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="h-8 text-lg font-medium text-gray-700 w-[300px]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameSave();
              if (e.key === 'Escape') handleNameCancel();
            }}
          />
          <Button variant="ghost" size="icon" onClick={handleNameSave} className="h-8 w-8">
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNameCancel} className="h-8 w-8">
            <CloseIcon className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ) : (
        <h2 
          className="text-lg font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
          onClick={() => setIsEditingName(true)}
        >
          {currentFile?.name}
        </h2>
      )}
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onConvertToSpreadsheet}
          className="bg-white/70 hover:bg-white/90 transition-colors"
        >
          <Table className="h-4 w-4 mr-2" />
          Convert to Spreadsheet
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/90"
          onClick={onSave}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button 
          variant={aiAssistantOpen ? "default" : "outline"}
          size="sm"
          onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
          className={aiAssistantOpen ? "bg-app-blue hover:bg-app-blue/90" : "bg-white/70 hover:bg-white/90"}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          AI Assistant
        </Button>
      </div>
    </div>
  );
};

export default DocumentHeader;
