
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Employee, Crew } from './types';

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Employee) => void;
  crews: Crew[];
  employee?: Employee | null;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  crews,
  employee = null
}) => {
  const [employeeForm, setEmployeeForm] = useState<Employee>({
    id: '',
    name: '',
    position: '',
    email: '',
    phone: '',
    crews: []
  });

  useEffect(() => {
    if (employee) {
      setEmployeeForm({
        ...employee,
        crews: employee.crews || []
      });
    } else {
      setEmployeeForm({
        id: '',
        name: '',
        position: '',
        email: '',
        phone: '',
        crews: []
      });
    }
  }, [employee, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCrew = (crewId: string) => {
    if (!employeeForm.crews?.includes(crewId)) {
      setEmployeeForm((prev) => ({
        ...prev,
        crews: [...(prev.crews || []), crewId]
      }));
    }
  };

  const handleRemoveCrew = (crewId: string) => {
    setEmployeeForm((prev) => ({
      ...prev,
      crews: (prev.crews || []).filter(id => id !== crewId)
    }));
  };

  const getCrewName = (crewId: string): string => {
    const crew = crews.find(crew => crew.id === crewId);
    return crew ? crew.name : 'Unknown Crew';
  };

  const handleSubmit = () => {
    if (!employeeForm.name || !employeeForm.position) {
      // Could show validation error here
      return;
    }

    onAddEmployee(employeeForm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            {employee 
              ? 'Update the employee details below.' 
              : 'Fill in the details below to add a new employee.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Full Name" 
              value={employeeForm.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Input 
              id="position" 
              name="position" 
              placeholder="Job Title" 
              value={employeeForm.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              placeholder="Email Address" 
              value={employeeForm.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              name="phone" 
              placeholder="Phone Number" 
              value={employeeForm.phone}
              onChange={handleInputChange}
            />
          </div>
          {crews.length > 0 && (
            <div className="grid gap-2">
              <Label>Assign to Crews</Label>
              <Select 
                onValueChange={handleAddCrew}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a crew" />
                </SelectTrigger>
                <SelectContent>
                  {crews.map(crew => (
                    <SelectItem 
                      key={crew.id} 
                      value={crew.id}
                      disabled={employeeForm.crews?.includes(crew.id)}
                    >
                      {crew.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {employeeForm.crews && employeeForm.crews.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {employeeForm.crews.map(crewId => (
                    <Badge 
                      key={crewId} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {getCrewName(crewId)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleRemoveCrew(crewId)}
                      >
                        &times;
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            {employee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
