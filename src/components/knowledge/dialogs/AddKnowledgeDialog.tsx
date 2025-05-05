
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { categories } from '../KnowledgeSidebar';
import { KnowledgeItem } from '../types';

interface AddKnowledgeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (newItem: Partial<KnowledgeItem>) => void;
}

export const AddKnowledgeDialog: React.FC<AddKnowledgeDialogProps> = ({ isOpen, onClose, onAddItem }) => {
  const [newItem, setNewItem] = useState<Partial<KnowledgeItem>>({
    title: '',
    content: '',
    category: 'docs',
    tags: []
  });

  // Add new tag to the current item being edited
  const handleAddTag = (tag: string) => {
    if (tag && !newItem.tags?.includes(tag)) {
      setNewItem({
        ...newItem,
        tags: [...(newItem.tags || []), tag]
      });
    }
  };

  // Remove tag from the current item being edited
  const handleRemoveTag = (tagToRemove: string) => {
    setNewItem({
      ...newItem,
      tags: newItem.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = () => {
    onAddItem(newItem);
    setNewItem({
      title: '',
      content: '',
      category: 'docs',
      tags: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Knowledge Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Item title"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <select
              id="category"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Textarea
              id="content"
              value={newItem.content}
              onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
              placeholder="Knowledge content"
              className="col-span-3"
              rows={5}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <div className="col-span-3">
              <div className="flex gap-2 mb-2 flex-wrap">
                {newItem.tags?.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="tagInput"
                  placeholder="Add tag (press Enter)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      handleAddTag(input.value);
                      input.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
