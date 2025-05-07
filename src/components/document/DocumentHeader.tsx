
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, MessageSquare, Save, Check, X as CloseIcon, 
  FileText, Download, Printer, Share2 
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

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
    <div className="flex flex-col bg-[#F6F6F7] dark:bg-[#1a1e25] border-b border-gray-200/50 sticky top-0 z-10">
      {/* Main menu bar */}
      <Menubar className="border-0 border-b border-gray-200/50 bg-transparent rounded-none px-2 h-9">
        <MenubarMenu>
          <MenubarTrigger className="text-sm">File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onSave}>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Save As... <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Print <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={onConvertToSpreadsheet}>Convert to Spreadsheet</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="text-sm">Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Cut <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Copy <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Paste <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="text-sm">View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Full Screen <MenubarShortcut>F11</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="text-sm">Insert</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Table</MenubarItem>
            <MenubarItem>Image</MenubarItem>
            <MenubarItem>Link</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Comment</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="text-sm">Format</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Bold</MenubarItem>
            <MenubarItem>Italic</MenubarItem>
            <MenubarItem>Underline</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Paragraph</MenubarItem>
            <MenubarItem>Styles</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        
        <MenubarMenu>
          <MenubarTrigger className="text-sm">Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Documentation</MenubarItem>
            <MenubarItem>Keyboard Shortcuts</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>About</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      
      {/* Document title and actions */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-gray-500 mr-2" />
          
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="h-7 text-base font-medium text-gray-700 w-[300px] border-blue-400 focus:border-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') handleNameCancel();
                }}
              />
              <Button variant="ghost" size="icon" onClick={handleNameSave} className="h-7 w-7">
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNameCancel} className="h-7 w-7">
                <CloseIcon className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ) : (
            <h2 
              className="text-base font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
              onClick={() => setIsEditingName(true)}
            >
              {currentFile?.name}
            </h2>
          )}
        </div>
        
        <TooltipProvider>
          <div className="flex space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onSave}
                  className="h-8 w-8"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save (Ctrl+S)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print (Ctrl+P)</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={aiAssistantOpen ? "default" : "outline"}
                  size="sm"
                  className={`h-8 ${aiAssistantOpen ? "bg-blue-600 hover:bg-blue-700" : "bg-white hover:bg-gray-50"}`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Assistant
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setAiAssistantOpen(!aiAssistantOpen)}>
                  {aiAssistantOpen ? "Close Assistant" : "Open Assistant"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onConvertToSpreadsheet}>
                  <Table className="h-4 w-4 mr-2" />
                  Convert to Spreadsheet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default DocumentHeader;
