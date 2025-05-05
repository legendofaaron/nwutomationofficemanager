
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Textarea } from '@/components/ui/textarea';
import DocumentHeader from './document/DocumentHeader';
import DocumentToolbar from './document/DocumentToolbar';
import ScheduleView from './ScheduleView';
import AiSuggestions from './document/AiSuggestions';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/ThemeContext';

const DocumentViewer = () => {
  const { currentFile, files, setFiles, setCurrentFile, setViewMode } = useAppContext();
  const [content, setContent] = useState(currentFile?.content || '');
  const { toast } = useToast();
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  
  // Set dark mode when document is opened
  useEffect(() => {
    if (currentFile) {
      setTheme('dark');
    }
    // Clean-up function not needed as we want document to stay in dark mode
  }, [currentFile, setTheme]);
  
  // Update content when currentFile changes
  useEffect(() => {
    if (currentFile?.content) {
      setContent(currentFile.content);
    }
  }, [currentFile]);

  if (!currentFile) {
    return (
      <div className={`flex items-center justify-center h-full ${resolvedTheme === 'superdark' ? 'bg-black' : ''}`}>
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

  const handleFormatText = (format: string) => {
    if (!textareaRef) return;
    
    const textarea = textareaRef;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = selectedText;
    let cursorOffset = 0;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        cursorOffset = 3;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        cursorOffset = 2;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        cursorOffset = 3;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        cursorOffset = 4;
        break;
      case 'bulletList':
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        cursorOffset = 2;
        break;
      case 'numberedList':
        formattedText = selectedText.split('\n').map((line, i) => `${i+1}. ${line}`).join('\n');
        cursorOffset = 3;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        cursorOffset = 1;
        break;
      case 'image':
        formattedText = `![${selectedText || 'Image'}](image_url)`;
        cursorOffset = 2;
        break;
      default:
        break;
    }

    if (formattedText !== selectedText) {
      const newContent = content.substring(0, start) + formattedText + content.substring(end);
      handleContentChange(newContent);
      
      // Set the cursor position after the operation is complete
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + formattedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
      
      toast({
        title: "Formatting applied",
        description: `${format} formatting applied to selected text`,
        duration: 1500,
      });
    }
  };

  const handleSave = () => {
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully",
      duration: 2000,
    });
  };

  const isDarkMode = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  const bgColor = isSuperDark ? 'bg-black' : isDarkMode ? 'bg-[#111318]' : 'bg-[#F6F6F7]';
  const cardBg = isSuperDark ? 'bg-[#090909] border-[#151515]' : isDarkMode ? 'bg-[#1a1e25] border-[#2a2f38]' : 'bg-white';
  const textareaBg = isSuperDark ? 'bg-[#090909] text-gray-200' : isDarkMode ? 'bg-[#1a1e25] text-gray-200' : '';

  return (
    <div className={`relative h-full ${bgColor}`}>
      <DocumentHeader 
        currentFile={currentFile}
        onNameChange={handleNameChange}
        onConvertToSpreadsheet={handleConvertToSpreadsheet}
        onSave={handleSave}
      />
      
      {!isSchedule && <DocumentToolbar onFormatText={handleFormatText} />}
      
      <ScrollArea className="h-[calc(100%-96px)]">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className={`${cardBg} rounded-lg shadow-sm min-h-[50vh]`}>
            {isSchedule ? (
              <ScheduleView />
            ) : (
              <>
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className={`min-h-[50vh] w-full resize-none p-6 font-sans text-base leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg ${textareaBg}`}
                  placeholder="Start typing..."
                  ref={(el) => setTextareaRef(el)}
                  style={{ color: isDarkMode || isSuperDark ? '#e4e4e7' : 'inherit' }}
                />
                <AiSuggestions 
                  content={content}
                  onSuggestionApply={handleSuggestionApply}
                />
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentViewer;
