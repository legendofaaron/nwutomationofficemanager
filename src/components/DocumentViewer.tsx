import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Save, Table, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, List, ListOrdered, Image, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
    <div className="relative h-full bg-[#F6F6F7]">
      {/* Top toolbar */}
      <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <h2 className="text-lg font-medium text-gray-700">{currentFile?.name}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={convertToSpreadsheet}
            className="bg-white/70 hover:bg-white/90 transition-colors"
          >
            <Table className="h-4 w-4 mr-2" />
            Convert to Spreadsheet
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
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

      {/* Formatting toolbar */}
      <div className="border-b border-gray-200/50 px-4 py-2 flex items-center gap-1 bg-white/50 backdrop-blur-sm sticky top-16 z-10">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <Underline className="h-4 w-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/90">
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Content area */}
      <div className="max-w-3xl mx-12 px-6 py-8">
        {!currentFile ? (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-gray-400">Select a document to view or edit</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm min-h-[70vh]">
            {isSchedule ? (
              <ScheduleView content={content} />
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[70vh] w-full resize-none p-6 font-sans text-base leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
                placeholder="Start typing..."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
