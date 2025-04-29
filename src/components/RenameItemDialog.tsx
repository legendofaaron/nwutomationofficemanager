
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

interface RenameItemDialogProps {
  item: { id: string; name: string; type: string };
  isOpen: boolean;
  onClose: () => void;
}

const RenameItemDialog = ({ item, isOpen, onClose }: RenameItemDialogProps) => {
  const [newName, setNewName] = useState('');
  const { files, setFiles } = useAppContext();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && item) {
      setNewName(item.name);
    }
  }, [isOpen, item]);

  const updateItemName = (files: any[], itemId: string, newName: string): any[] => {
    return files.map(file => {
      if (file.id === itemId) {
        return { ...file, name: newName };
      }
      if (file.children) {
        return {
          ...file,
          children: updateItemName(file.children, itemId, newName)
        };
      }
      return file;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newName.trim()) {
      const updatedFiles = updateItemName(files, item.id, newName);
      setFiles(updatedFiles);
      
      toast({
        title: "Item renamed",
        description: `Item has been renamed to ${newName}`
      });
      
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Name</Label>
            <Input
              id="itemName"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameItemDialog;
