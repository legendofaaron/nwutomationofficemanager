
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderPlus, FolderOpen, ArrowUp, HardDrive, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FolderBrowserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  initialPath?: string;
}

export const FolderBrowserDialog: React.FC<FolderBrowserDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialPath = '/shared'
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  
  // Mock folder structure for the UI demonstration
  const [folderStructure, setFolderStructure] = useState({
    '/': ['shared', 'documents', 'downloads'],
    '/shared': ['files', 'images', 'documents'],
    '/shared/files': [],
    '/shared/images': [],
    '/shared/documents': ['contracts', 'reports'],
    '/documents': ['work', 'personal'],
    '/downloads': []
  });
  
  const navigateUp = () => {
    if (currentPath === '/') return;
    
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.length === 0 ? '/' : `/${pathParts.join('/')}`;
    setCurrentPath(newPath);
  };
  
  const navigateTo = (folder: string) => {
    const newPath = currentPath === '/' ? `/${folder}` : `${currentPath}/${folder}`;
    setCurrentPath(newPath);
  };
  
  const createNewFolder = () => {
    if (!newFolderName.trim()) return;
    
    // Update our mock folder structure
    setFolderStructure(prev => {
      const currentFolders = [...(prev[currentPath] || [])];
      if (!currentFolders.includes(newFolderName)) {
        currentFolders.push(newFolderName);
      }
      
      const newPath = currentPath === '/' ? `/${newFolderName}` : `${currentPath}/${newFolderName}`;
      
      return {
        ...prev,
        [currentPath]: currentFolders,
        [newPath]: []
      };
    });
    
    setNewFolderName('');
    setShowNewFolderInput(false);
  };
  
  const getCurrentFolders = () => {
    return folderStructure[currentPath] || [];
  };
  
  const handleSelect = () => {
    onSelect(currentPath);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Folder</DialogTitle>
          <DialogDescription>
            Choose a folder for shared documents
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-2 my-4">
          <Button variant="outline" size="icon" onClick={navigateUp}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <div className="flex-1 flex items-center bg-muted px-3 py-1 rounded-md">
            <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm truncate">{currentPath}</span>
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowNewFolderInput(true)}>
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
        
        {showNewFolderInput && (
          <div className="flex gap-2 mb-4">
            <Input
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              placeholder="New folder name"
              autoFocus
            />
            <Button variant="outline" size="icon" onClick={createNewFolder}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <ScrollArea className="h-[200px] border rounded-md">
          <div className="p-2 space-y-1">
            {getCurrentFolders().length === 0 ? (
              <div className="flex justify-center items-center h-24 text-sm text-muted-foreground">
                This folder is empty
              </div>
            ) : (
              getCurrentFolders().map(folder => (
                <div
                  key={folder}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => navigateTo(folder)}
                >
                  <FolderOpen className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">{folder}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect}>
            Select This Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
