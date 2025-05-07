
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Employee, Crew } from './types';

interface CrewAssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrew: Crew | null;
  employees: Employee[];
  onSave: (crewId: string, memberIds: string[]) => void;
}

const CrewAssignDialog: React.FC<CrewAssignDialogProps> = ({
  isOpen,
  onClose,
  selectedCrew,
  employees,
  onSave
}) => {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

  // Update selected employees when the crew changes
  useEffect(() => {
    if (selectedCrew) {
      setSelectedEmployeeIds(selectedCrew.members || []);
    } else {
      setSelectedEmployeeIds([]);
    }
  }, [selectedCrew]);

  const handleToggleEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployeeIds(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployeeIds(prev => prev.filter(id => id !== employeeId));
    }
  };

  const handleSave = () => {
    if (selectedCrew) {
      onSave(selectedCrew.id, selectedEmployeeIds);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Crew Members</DialogTitle>
          <DialogDescription>
            {selectedCrew ? (
              <>Add or remove members from the <strong>{selectedCrew.name}</strong> crew.</>
            ) : (
              <>Select a crew to manage its members.</>
            )}
          </DialogDescription>
        </DialogHeader>
        {selectedCrew && (
          <>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`employee-${employee.id}`}
                      checked={selectedEmployeeIds.includes(employee.id)}
                      onCheckedChange={(checked) => handleToggleEmployee(employee.id, checked === true)}
                    />
                    <Label 
                      htmlFor={`employee-${employee.id}`}
                      className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {employee.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p>{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.position}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleSave}>
                Save Changes
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CrewAssignDialog;
