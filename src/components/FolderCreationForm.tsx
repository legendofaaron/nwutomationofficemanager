
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FolderCreationFormProps {
  folderName: string;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const FolderCreationForm = ({
  folderName,
  onNameChange,
  onSubmit,
  onCancel,
}: FolderCreationFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="folderName">Folder Name</Label>
        <Input
          id="folderName"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => onNameChange(e.target.value)}
          className="col-span-3"
          autoFocus
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Folder</Button>
      </div>
    </form>
  );
};

export default FolderCreationForm;
