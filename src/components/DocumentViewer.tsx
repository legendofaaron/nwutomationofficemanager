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
import { usePremiumFeature } from '@/hooks/usePremiumFeature';
import FloatingMenuBar from './document/FloatingMenuBar';
import GenerateDocumentDialog from './document/GenerateDocumentDialog';
import { Button } from './ui/button';
import { FileText, Save, Loader2 } from 'lucide-react';

const DocumentViewer = () => {
  const { currentFile, files, setFiles, setCurrentFile, setViewMode } = useAppContext();
  const [content, setContent] = useState(currentFile?.content || '');
  const { toast } = useToast();
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Add premium feature hook
  const { checkAccess, PremiumFeatureGate } = usePremiumFeature();
  
  // Set dark mode when document is opened
  useEffect(() => {
    if (currentFile) {
      setTheme('dark');
    }
  }, [currentFile, setTheme]);
  
  // Update content when currentFile changes
  useEffect(() => {
    if (currentFile?.content) {
      setContent(currentFile.content);
    }
  }, [currentFile]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (currentFile && content !== currentFile.content) {
        handleContentChange(content);
      }
    }, 2000);
    
    return () => clearTimeout(autoSaveTimer);
  }, [content]);

  if (!currentFile) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${resolvedTheme === 'superdark' ? 'bg-black' : ''}`}>
        <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
        <p className="text-gray-400 mb-6">Select a document to view or edit</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setViewMode('files')}>
            Browse Files
          </Button>
          <GenerateDocumentDialog />
        </div>
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
    // Check if user has access to premium features
    if (!checkAccess('Spreadsheet Conversion')) {
      return;
    }
    
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
    // Check if user has access to AI suggestions
    if (!checkAccess('AI Suggestions')) {
      return;
    }
    
    handleContentChange(suggestion);
  };

  const trackSelection = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    setSelectionStart(textarea.selectionStart);
    setSelectionEnd(textarea.selectionEnd);
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
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        cursorOffset = 2;
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
      case 'alignLeft':
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        cursorOffset = 30;
        break;
      case 'alignCenter':
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        cursorOffset = 32;
        break;
      case 'alignRight':
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        cursorOffset = 31;
        break;
      case 'alignJustify':
        formattedText = `<div style="text-align: justify">${selectedText}</div>`;
        cursorOffset = 33;
        break;
      case 'indent':
        formattedText = selectedText.split('\n').map(line => `  ${line}`).join('\n');
        cursorOffset = 2;
        break;
      case 'outdent':
        formattedText = selectedText.split('\n').map(line => line.replace(/^  /, '')).join('\n');
        cursorOffset = 0;
        break;
      default:
        break;
    }

    if (formattedText !== selectedText || format === 'undo' || format === 'redo') {
      if (format === 'undo') {
        document.execCommand('undo');
      } else if (format === 'redo') {
        document.execCommand('redo');
      } else {
        const newContent = content.substring(0, start) + formattedText + content.substring(end);
        handleContentChange(newContent);
        
        // Set the cursor position after the operation is complete
        setTimeout(() => {
          textarea.focus();
          const newCursorPos = start + formattedText.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      }
      
      toast({
        title: "Formatting applied",
        description: `${format} formatting applied`,
        duration: 1500,
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully",
      duration: 2000,
    });
    
    setIsSaving(false);
  };

  const isDarkMode = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  const bgColor = isSuperDark ? 'bg-black' : isDarkMode ? 'bg-[#111318]' : 'bg-[#F6F6F7]';
  const cardBg = isSuperDark ? 'bg-[#090909] border-[#151515]' : isDarkMode ? 'bg-[#1a1e25] border-[#2a2f38]' : 'bg-white';
  const textareaBg = isSuperDark ? 'bg-[#090909] text-gray-200' : isDarkMode ? 'bg-[#1a1e25] text-gray-200' : 'bg-white';

  return (
    <div className={`relative h-full ${bgColor}`}>
      {/* Add Floating Menu Bar */}
      <FloatingMenuBar 
        onSave={handleSave}
        onFormatText={handleFormatText} 
      />
      
      {/* Add the Premium Feature Gate component */}
      <PremiumFeatureGate />
      
      <DocumentHeader 
        currentFile={currentFile}
        onNameChange={handleNameChange}
        onConvertToSpreadsheet={handleConvertToSpreadsheet}
        onSave={handleSave}
      />
      
      {!isSchedule && <DocumentToolbar onFormatText={handleFormatText} />}
      
      <ScrollArea className="h-[calc(100%-96px)]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className={`${cardBg} rounded-lg shadow-sm min-h-[70vh] border border-gray-200/20`}>
            {isSchedule ? (
              <ScheduleView />
            ) : (
              <>
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onMouseUp={trackSelection}
                  onKeyUp={trackSelection}
                  className={`min-h-[70vh] w-full resize-none p-8 font-serif text-base leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg ${textareaBg}`}
                  placeholder="Start typing..."
                  ref={(el) => setTextareaRef(el)}
                  style={{ 
                    color: isDarkMode || isSuperDark ? '#e4e4e7' : '#333333',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em'
                  }}
                />
                <AiSuggestions 
                  content={content}
                  onSuggestionApply={handleSuggestionApply}
                />
              </>
            )}
          </div>
          {currentFile.type === 'document' && (
            <div className="flex justify-end mt-4">
              <Button
                variant={isSaving ? "outline" : "default"}
                className="min-w-[100px]"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentViewer;
