
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from 'lucide-react';
import { Employee, Crew } from './types';

interface CrewAssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignEmployeeToCrew: () => void;
  employees: Employee[];
  crews: Crew[];
  selectedEmployee: string | null;
  selectedCrew: string | null;
  setSelectedEmployee: (employeeId: string | null) => void;
  setSelectedCrew: (crewId: string | null) => void;
}

const CrewAssignDialog: React.FC<CrewAssignDialogProps> = ({
  isOpen,
  onClose,
  onAssignEmployeeToCrew,
  employees,
  crews,
  selectedEmployee,
  selectedCrew,
  setSelectedEmployee,
  setSelectedCrew
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign to Crew</DialogTitle>
          <DialogDescription>
            Select an employee and a crew to assign them to.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="employee">Employee</Label>
            <Select 
              value={selectedEmployee || ""}
              onValueChange={setSelectedEmployee}
            >
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="crew">Crew</Label>
            <Select 
              value={selectedCrew || ""}
              onValueChange={setSelectedCrew}
            >
              <SelectTrigger id="crew">
                <SelectValue placeholder="Select crew" />
              </SelectTrigger>
              <SelectContent>
                {crews.map(crew => (
                  <SelectItem key={crew.id} value={crew.id}>
                    {crew.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={onAssignEmployeeToCrew}
            disabled={!selectedEmployee || !selectedCrew}
          >
            <Check className="mr-2 h-4 w-4" />
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrewAssignDialog;
