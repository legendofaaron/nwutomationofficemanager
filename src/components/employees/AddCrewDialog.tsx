
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Crew, Employee } from './types';

interface AddCrewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCrew: (crew: Omit<Crew, 'id'>) => void;
  employees: Employee[];
}

const AddCrewDialog: React.FC<AddCrewDialogProps> = ({
  isOpen,
  onClose,
  onAddCrew,
  employees
}) => {
  const [newCrew, setNewCrew] = useState<Omit<Crew, 'id'>>({
    name: '',
    members: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCrew(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCrew = () => {
    onAddCrew(newCrew);
    // Reset form
    setNewCrew({
      name: '',
      members: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Crew</DialogTitle>
          <DialogDescription>
            Create a crew and assign employees to work together.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="crewName">Crew Name</Label>
            <Input 
              id="crewName" 
              name="name" 
              placeholder="Crew Name" 
              value={newCrew.name}
              onChange={handleInputChange}
              required
            />
          </div>
          {employees.length > 0 && (
            <div className="grid gap-2">
              <Label>Add Members</Label>
              <Select 
                onValueChange={(value) => {
                  setNewCrew(prev => ({
                    ...prev,
                    members: [...prev.members, value]
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employees" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newCrew.members.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newCrew.members.map(memberId => {
                    const employee = employees.find(e => e.id === memberId);
                    return (
                      <Badge 
                        key={memberId} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {employee?.name || 'Unknown'}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            setNewCrew(prev => ({
                              ...prev,
                              members: prev.members.filter(id => id !== memberId)
                            }));
                          }}
                        >
                          &times;
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleAddCrew}>Create Crew</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCrewDialog;
