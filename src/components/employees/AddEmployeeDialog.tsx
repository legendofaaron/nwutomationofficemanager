
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';
import { Employee, Crew } from './types';

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  crews: Crew[];
  getCrewNameById: (crewId: string) => string;
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  crews,
  getCrewNameById
}) => {
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    name: '',
    position: '',
    email: '',
    phone: '',
    crews: []
  });
  
  const [employeeImagePreview, setEmployeeImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmployeeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setEmployeeImagePreview(imageUrl);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddEmployee = () => {
    onAddEmployee(newEmployee);
    // Reset form
    setNewEmployee({
      name: '',
      position: '',
      email: '',
      phone: '',
      crews: []
    });
    setEmployeeImagePreview('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new employee to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center mb-2">
            <div 
              className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer mb-2"
              onClick={triggerFileInput}
            >
              {employeeImagePreview ? (
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={employeeImagePreview} 
                    alt="Employee preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <UserPlus className="h-8 w-8 text-gray-400" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleEmployeeImageChange}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {employeeImagePreview ? "Change photo" : "Add employee photo"}
            </span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Full Name" 
              value={newEmployee.name}
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
              value={newEmployee.position}
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
              value={newEmployee.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              name="phone" 
              placeholder="Phone Number" 
              value={newEmployee.phone}
              onChange={handleInputChange}
            />
          </div>
          {crews.length > 0 && (
            <div className="grid gap-2">
              <Label>Assign to Crews</Label>
              <Select 
                onValueChange={(value) => {
                  setNewEmployee(prev => ({
                    ...prev,
                    crews: [...(prev.crews || []), value]
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a crew" />
                </SelectTrigger>
                <SelectContent>
                  {crews.map(crew => (
                    <SelectItem 
                      key={crew.id} 
                      value={crew.id}
                      disabled={newEmployee.crews?.includes(crew.id)}
                    >
                      {crew.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newEmployee.crews && newEmployee.crews.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newEmployee.crews.map(crewId => (
                    <Badge 
                      key={crewId} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {getCrewNameById(crewId)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => {
                          setNewEmployee(prev => ({
                            ...prev,
                            crews: prev.crews?.filter(id => id !== crewId) || []
                          }));
                        }}
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
          <Button type="button" onClick={handleAddEmployee}>Add Employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
