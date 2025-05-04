
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Textarea } from '@/components/ui/textarea';
import DocumentHeader from './document/DocumentHeader';
import DocumentToolbar from './document/DocumentToolbar';
import ScheduleView from './ScheduleView';
import AiSuggestions from './document/AiSuggestions';

const DocumentViewer = () => {
  const { currentFile, files, setFiles, setCurrentFile, setViewMode } = useAppContext();
  const [content, setContent] = useState(currentFile?.content || '');
  
  // Update content when currentFile changes
  useEffect(() => {
    if (currentFile?.content) {
      setContent(currentFile.content);
    }
  }, [currentFile]);

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Select a document to view or edit</p>
      </div>
    );
  }

  const isSchedule = currentFile.name.toLowerCase().includes('schedule');

  const handleNameChange = (newName: string) => {
    if (!currentFile) return;
    
    const updatedFile = { ...currentFile, name: newName };
    setCurrentFile(updatedFile);
    
    const updateFiles = (filesArray: any[]): any[] => {
      return filesArray.map(file => {
        if (file.id === currentFile.id) {
          return updatedFile;
        }
        if (file.children) {
          return { ...file, children: updateFiles(file.children) };
        }
        return file;
      });
    };
    
    setFiles(updateFiles(files));
  };

  const handleConvertToSpreadsheet = () => {
    const spreadsheetData = {
      headers: ['Column 1', 'Column 2', 'Column 3'],
      rows: [
        { 'Column 1': '', 'Column 2': '', 'Column 3': '' },
        { 'Column 1': '', 'Column 2': '', 'Column 3': '' }
      ]
    };
    
    const newSpreadsheet = {
      ...currentFile,
      id: Date.now().toString(),
      name: currentFile.name.replace('.txt', '.xlsx').replace('.md', '.xlsx'),
      type: 'spreadsheet' as const,
      spreadsheetData
    };
    
    const updateFiles = (filesArray: any[], newFile: any): any[] => {
      const spreadsheetFolder = filesArray.find(file => 
        file.type === 'folder' && file.name === 'Spreadsheets'
      );
      
      if (spreadsheetFolder) {
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
    
    const updatedFiles = updateFiles(files, newSpreadsheet);
    setFiles(updatedFiles);
    setCurrentFile(newSpreadsheet);
    setViewMode('spreadsheet');
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    // Update the current file with new content
    if (currentFile) {
      const updatedFile = { ...currentFile, content: newContent };
      setCurrentFile(updatedFile);
      
      // Update in files tree
      const updateFiles = (filesArray: any[]): any[] => {
        return filesArray.map(file => {
          if (file.id === currentFile.id) {
            return updatedFile;
          }
          if (file.children) {
            return { ...file, children: updateFiles(file.children) };
          }
          return file;
        });
      };
      
      setFiles(updateFiles(files));
    }
  };

  const handleSuggestionApply = (suggestion: string) => {
    handleContentChange(suggestion);
  };

  return (
    <div className="relative h-full bg-[#F6F6F7]">
      <DocumentHeader 
        currentFile={currentFile}
        onNameChange={handleNameChange}
        onConvertToSpreadsheet={handleConvertToSpreadsheet}
      />
      <DocumentToolbar />
      
      <div className="max-w-3xl mx-12 px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm min-h-[70vh]">
          {isSchedule ? (
            <ScheduleView />
          ) : (
            <>
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[70vh] w-full resize-none p-6 font-sans text-base leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
                placeholder="Start typing..."
              />
              <AiSuggestions 
                content={content}
                onSuggestionApply={handleSuggestionApply}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
