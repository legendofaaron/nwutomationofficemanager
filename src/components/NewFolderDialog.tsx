
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import FolderCreationForm from './FolderCreationForm';

const NewFolderDialog = () => {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const { files, setFiles } = useAppContext();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: folderName || 'New Folder',
      type: 'folder' as const,
      children: []
    };
    
    setFiles([...files, newFolder]);
    setOpen(false);
    setFolderName('');
    
    toast({
      title: "Folder created",
      description: `${newFolder.name} has been created`
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setFolderName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <FolderPlus className="w-4 h-4 mr-2" />
          <span>New Folder</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <FolderCreationForm
          folderName={folderName}
          onNameChange={setFolderName}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewFolderDialog;
