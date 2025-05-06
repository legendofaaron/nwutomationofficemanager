
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Users } from 'lucide-react';
import { TaskFormData, AssignmentType, Crew, Employee } from '../ScheduleTypes';
import { getEmployeeOptions, getCrewOptions } from '../ScheduleHelpers';

interface AssignmentTabProps {
  formData: TaskFormData;
  setFormData: (data: TaskFormData) => void;
  assignmentType: AssignmentType;
  setAssignmentType: (type: AssignmentType) => void;
  crews: Crew[];
  employees: Employee[];
}

const AssignmentTab: React.FC<AssignmentTabProps> = ({
  formData,
  setFormData,
  assignmentType,
  setAssignmentType,
  crews,
  employees
}) => {
  // Get crew member names as a comma-separated string
  const getCrewMemberNames = (crewId: string, crewsList: Crew[]): string => {
    const crew = crewsList.find(c => c.id === crewId);
    if (!crew) return 'No crew members';
    
    return crew.memberIds
      .map(id => {
        const employee = employees.find(e => e.id === id);
        return employee ? employee.name : '';
      })
      .filter(name => name) // Remove empty names
      .join(', ');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base">Assignment Type</Label>
        <div className="flex space-x-4">
          <Button 
            variant={assignmentType === 'individual' ? 'default' : 'outline'} 
            onClick={() => setAssignmentType('individual')}
            className="flex items-center flex-1"
            type="button"
          >
            <User className="h-4 w-4 mr-2" />
            Individual
          </Button>
          <Button 
            variant={assignmentType === 'crew' ? 'default' : 'outline'} 
            onClick={() => setAssignmentType('crew')}
            className="flex items-center flex-1"
            type="button"
          >
            <Users className="h-4 w-4 mr-2" />
            Crew
          </Button>
        </div>
      </div>
      
      {assignmentType === 'individual' ? (
        <div className="space-y-2">
          <Label className="text-base" htmlFor="employee">Assign To</Label>
          <Select
            value={formData.assignedTo}
            onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
          >
            <SelectTrigger className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#1D1D1D] dark:border-gray-700">
              {getEmployeeOptions(employees)}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-base" htmlFor="crew">Assign To Crew</Label>
          <Select
            value={formData.assignedCrew}
            onValueChange={(value) => setFormData({ ...formData, assignedCrew: value })}
          >
            <SelectTrigger className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg">
              <SelectValue placeholder="Select crew" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#1D1D1D] dark:border-gray-700">
              {getCrewOptions(crews)}
            </SelectContent>
          </Select>
          
          {formData.assignedCrew && (
            <div className="mt-2 text-sm text-muted-foreground bg-muted/30 dark:bg-[#1A1A1A] p-3 rounded-md">
              <div className="font-medium text-foreground dark:text-gray-100">Crew members:</div>
              <div className="mt-1">{getCrewMemberNames(formData.assignedCrew, crews)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentTab;
