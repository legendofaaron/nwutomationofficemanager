
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Save, Table } from 'lucide-react';
import ScheduleView from './ScheduleView';

const DocumentViewer = () => {
  const { currentFile, aiAssistantOpen, setAiAssistantOpen, setViewMode, files, setFiles, setCurrentFile } = useAppContext();
  const [content, setContent] = useState(currentFile?.content || '');
  
  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Select a document to view or edit</p>
      </div>
    );
  }

  const isSchedule = currentFile.name.toLowerCase().includes('schedule');

  const convertToSpreadsheet = () => {
    // Create default spreadsheet data
    const spreadsheetData = {
      headers: ['Column 1', 'Column 2', 'Column 3'],
      rows: [
        { 'Column 1': '', 'Column 2': '', 'Column 3': '' },
        { 'Column 1': '', 'Column 2': '', 'Column 3': '' }
      ]
    };
    
    // Create a new spreadsheet file based on the current document
    const newSpreadsheet = {
      ...currentFile,
      id: Date.now().toString(),
      name: currentFile.name.replace('.txt', '.xlsx').replace('.md', '.xlsx'),
      type: 'spreadsheet' as const,
      spreadsheetData
    };
    
    // Create a deep copy of files
    const updateFiles = (filesArray: any[], newFile: any): any[] => {
      // Look for the Spreadsheets folder
      const spreadsheetFolder = filesArray.find(file => 
        file.type === 'folder' && file.name === 'Spreadsheets'
      );
      
      if (spreadsheetFolder) {
        // Add the new file to the Spreadsheets folder
        return filesArray.map(file => {
          if (file.id === spreadsheetFolder.id) {
            return {
              ...file,
              children: [...(file.children || []), newFile]
            };
          }
          return file;
        });
      }
      
      // If Spreadsheets folder doesn't exist, create it
      return [
        ...filesArray,
        {
          id: 'spreadsheets-folder',
          name: 'Spreadsheets',
          type: 'folder' as const,
          children: [newFile]
        }
      ];
    };
    
    // Update files
    const updatedFiles = updateFiles(files, newSpreadsheet);
    setFiles(updatedFiles);
    
    // Set the current file to the new spreadsheet
    setCurrentFile(newSpreadsheet);
    
    // Switch to spreadsheet view
    setViewMode('spreadsheet');
  };

  return (
    <div className="relative h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">{currentFile.name}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={convertToSpreadsheet}
          >
            <Table className="h-4 w-4 mr-2" />
            Convert to Spreadsheet
          </Button>
          <Button variant="ghost" size="icon">
            <Save className="h-4 w-4" />
          </Button>
          <Button 
            variant={aiAssistantOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>
      
      <div className="p-6 pb-20">
        {isSchedule ? (
          <ScheduleView content={content} />
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] resize-none p-4 font-mono text-base leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Start typing..."
          />
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
