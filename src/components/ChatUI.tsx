import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, SendHorizontal } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

const ChatUI = () => {
  const {
    setViewMode,
    setCurrentFile,
    files,
    setFiles,
    currentFile
  } = useAppContext();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your office assistant. I can help you create, edit, and manage documents, spreadsheets, and more. Just tell me what you'd like to do!"
    }
  ]);
  const [input, setInput] = useState('');

  const handleCommand = (command: string) => {
    const lowercaseCommand = command.toLowerCase();
    
    // Handle document naming
    if (lowercaseCommand.startsWith('name document') || lowercaseCommand.startsWith('rename document')) {
      const newName = command.replace(/name document|rename document/i, '').trim();
      if (!currentFile || !newName) {
        return "Please specify a name for the document or open a document first.";
      }

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
      toast({
        title: "Document Renamed",
        description: `Document renamed to "${newName}"`
      });
      
      return `I've renamed the document to "${newName}"`;
    }
    
    // Handle writing content to document
    if (lowercaseCommand.startsWith('write') || lowercaseCommand.startsWith('add content')) {
      const content = command.replace(/write|add content/i, '').trim();
      if (!currentFile) {
        return "Please open or create a document first.";
      }
      
      const updatedFile = {
        ...currentFile,
        content: currentFile.content 
          ? `${currentFile.content}\n${content}`
          : content
      };
      
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
      toast({
        title: "Content Added",
        description: "Content has been added to the document"
      });
      
      return "I've added the content to your document.";
    }
    
    // Create new document with name and content
    if (lowercaseCommand.startsWith('create document')) {
      const input = command.replace(/create document/i, '').trim();
      let documentName = 'New Document';
      let content = '';
      
      // Check if the command includes "named" to separate name and content
      if (input.includes('named')) {
        const [beforeNamed, afterNamed] = input.split(/named/i);
        content = beforeNamed.trim();
        documentName = afterNamed.trim() || 'New Document';
      } else {
        content = input;
      }
      
      const newDocument = {
        id: Date.now().toString(),
        name: documentName,
        type: 'document' as const,
        content: content || '# New Document\n\nStart writing here...'
      };
      
      // Find Documents folder or create it
      const updateFiles = (filesArray: any[]): any[] => {
        const documentsFolder = filesArray.find(file => 
          file.type === 'folder' && file.name === 'Documents'
        );
        
        if (documentsFolder) {
          return filesArray.map(file => {
            if (file.id === documentsFolder.id) {
              return {
                ...file,
                children: [...(file.children || []), newDocument]
              };
            }
            return file;
          });
        }
        
        return [
          ...filesArray,
          {
            id: 'documents-folder',
            name: 'Documents',
            type: 'folder' as const,
            children: [newDocument]
          }
        ];
      };
      
      const updatedFiles = updateFiles(files);
      setFiles(updatedFiles);
      setCurrentFile(newDocument);
      setViewMode('document');
      
      toast({
        title: "Document Created",
        description: `Created document "${documentName}"`
      });
      
      return `I've created a new document named "${documentName}" with your content. Opening it now.`;
    }
    
    // Handle spreadsheet creation
    if (lowercaseCommand.includes('create spreadsheet') || lowercaseCommand.includes('new spreadsheet') || lowercaseCommand.includes('new excel')) {
      const spreadsheetData = {
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [
          { 'Column 1': '', 'Column 2': '', 'Column 3': '' },
          { 'Column 1': '', 'Column 2': '', 'Column 3': '' }
        ]
      };
      
      const newSpreadsheet = {
        id: Date.now().toString(),
        name: 'New Spreadsheet.xlsx',
        type: 'spreadsheet' as const,
        spreadsheetData
      };
      
      // Find Spreadsheets folder or create it
      const updateFiles = (filesArray: any[]): any[] => {
        const spreadsheetFolder = filesArray.find(file => 
          file.type === 'folder' && file.name === 'Spreadsheets'
        );
        
        if (spreadsheetFolder) {
          return filesArray.map(file => {
            if (file.id === spreadsheetFolder.id) {
              return {
                ...file,
                children: [...(file.children || []), newSpreadsheet]
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
            type: 'folder',
            children: [newSpreadsheet]
          }
        ];
      };
      
      setFiles(updateFiles(files));
      setCurrentFile(newSpreadsheet);
      setViewMode('spreadsheet');
      
      toast({
        title: "Spreadsheet Created",
        description: "Opening new spreadsheet for editing"
      });
      
      return "I've created a new spreadsheet for you. Opening it now.";
    }
    
    // Handle document creation
    else if (lowercaseCommand.includes('create document') || lowercaseCommand.includes('new document')) {
      const newFile = {
        id: Date.now().toString(),
        name: 'New Document',
        type: 'document' as const,
        content: '# New Document\n\nStart writing here...'
      };
      setCurrentFile(newFile);
      setViewMode('document');
      toast({
        title: "Document Created",
        description: "Opening new document for editing"
      });
      
      return "I've created a new document for you. Opening it now.";
    }
    
    // Handle writing to current document
    else if (lowercaseCommand.includes('write') && currentFile) {
      const content = command.replace(/write|in document|in file/gi, '').trim();
      setCurrentFile({
        ...currentFile,
        content: currentFile.content ? `${currentFile.content}\n${content}` : content
      });
      toast({
        title: "Content Added",
        description: "The content has been added to the document"
      });
    }
    
    // Handle schedule creation
    else if (lowercaseCommand.includes('create schedule') || lowercaseCommand.includes('new schedule')) {
      const newSchedule = {
        id: Date.now().toString(),
        name: 'New Schedule',
        type: 'document' as const,
        content: '# Schedule\n\n## Tasks\n\n'
      };
      setCurrentFile(newSchedule);
      setViewMode('document');
      toast({
        title: "Schedule Created",
        description: "Opening schedule creator"
      });
    }
    
    // Handle file deletion
    else if (lowercaseCommand.includes('delete')) {
      const fileName = command.toLowerCase().replace('delete', '').trim();
      const file = files.find(f => f.name.toLowerCase().includes(fileName));
      if (file) {
        // In a real implementation, you would call an API to delete the file
        toast({
          title: "File Deleted",
          description: `${file.name} has been deleted`
        });
      }
    }
    
    // Handle file navigation
    else if (lowercaseCommand.includes('open')) {
      const fileName = command.toLowerCase().replace('open', '').trim();
      const file = files.find(f => f.name.toLowerCase().includes(fileName));
      if (file) {
        setCurrentFile(file);
        setViewMode('document');
        toast({
          title: "Opening File",
          description: `Opening ${file.name}`
        });
      }
    }
    
    // Handle file search
    else if (lowercaseCommand.includes('find') || lowercaseCommand.includes('search')) {
      const searchTerm = command.replace(/find|search|file/gi, '').trim();
      const foundFiles = files.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.content && f.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      if (foundFiles.length > 0) {
        const fileList = foundFiles.map(f => f.name).join(', ');
        return `I found these files matching "${searchTerm}": ${fileList}`;
      } else {
        return `I couldn't find any files matching "${searchTerm}"`;
      }
    }
    
    // Handle database table navigation
    else if (lowercaseCommand.includes('show table') || lowercaseCommand.includes('open table')) {
      const tableName = command.toLowerCase().replace('show table', '').replace('open table', '').trim();
      const table = databaseTables.find(t => t.name.toLowerCase().includes(tableName));
      if (table) {
        setCurrentTable(table);
        setViewMode('database');
        toast({
          title: "Opening Table",
          description: `Opening ${table.name} table`
        });
      }
    }
    
    // Handle spreadsheet-specific commands
    else if (currentFile && currentFile.type === 'spreadsheet' && lowercaseCommand.includes('add row')) {
      if (currentFile.spreadsheetData) {
        const newRow: Record<string, any> = {};
        currentFile.spreadsheetData.headers.forEach(header => {
          newRow[header] = '';
        });
        
        const updatedSpreadsheetData = {
          ...currentFile.spreadsheetData,
          rows: [...currentFile.spreadsheetData.rows, newRow]
        };
        
        const updatedFile = {
          ...currentFile,
          spreadsheetData: updatedSpreadsheetData
        };
        
        setCurrentFile(updatedFile);
        
        // Update in files array
        const updateFilesWithNewRow = (filesArray: any[]): any[] => {
          return filesArray.map(file => {
            if (file.id === updatedFile.id) {
              return updatedFile;
            } else if (file.children) {
              return { ...file, children: updateFilesWithNewRow(file.children) };
            }
            return file;
          });
        };
        
        setFiles(updateFilesWithNewRow(files));
        
        toast({
          title: "Row Added",
          description: "A new row has been added to your spreadsheet"
        });
        
        return "I've added a new row to your spreadsheet.";
      }
    }
    
    else if (currentFile && currentFile.type === 'spreadsheet' && lowercaseCommand.includes('add column')) {
      if (currentFile.spreadsheetData) {
        const columnName = `Column ${currentFile.spreadsheetData.headers.length + 1}`;
        
        const newHeaders = [...currentFile.spreadsheetData.headers, columnName];
        
        const newRows = currentFile.spreadsheetData.rows.map(row => ({
          ...row,
          [columnName]: ''
        }));
        
        const updatedSpreadsheetData = {
          headers: newHeaders,
          rows: newRows
        };
        
        const updatedFile = {
          ...currentFile,
          spreadsheetData: updatedSpreadsheetData
        };
        
        setCurrentFile(updatedFile);
        
        // Update in files array
        const updateFilesWithNewColumn = (filesArray: any[]): any[] => {
          return filesArray.map(file => {
            if (file.id === updatedFile.id) {
              return updatedFile;
            } else if (file.children) {
              return { ...file, children: updateFilesWithNewColumn(file.children) };
            }
            return file;
          });
        };
        
        setFiles(updateFilesWithNewColumn(files));
        
        toast({
          title: "Column Added",
          description: `A new column "${columnName}" has been added to your spreadsheet`
        });
        
        return `I've added a new column "${columnName}" to your spreadsheet.`;
      }
    }
    
    return `I'll help you with "${command}" right away.`;
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };
    
    // Process the command and get potential response
    const commandResponse = handleCommand(input);
    
    // Add assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: commandResponse || `I've processed your request: "${input}"`
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 shadow-lg hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[400px] h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col z-20 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-2 p-3 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-app-blue" />
          <h3 className="font-medium">Office Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-app-blue text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
