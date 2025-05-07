
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Save, Pencil } from 'lucide-react';
import { Task, TaskFormData, AssignmentType, LocationType, Crew, Employee, Client, ClientLocation } from '../ScheduleTypes';
import BasicInfoTab from './BasicInfoTab';
import AssignmentTab from './AssignmentTab';
import { initializeFormData, getInitialAssignmentType, getInitialLocationType } from './TaskEditFormData';

interface TaskEditDialogProps {
  task: Task | null;
  crews: Crew[];
  employees: Employee[];
  clients: Client[];
  clientLocations?: ClientLocation[];
  onSave: (taskData: Partial<Task>, isNew: boolean) => void;
  onDelete: (taskId: string) => void;
  onCancel: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaveChanges?: (taskId: string, updatedData: Partial<Task>) => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  task,
  crews,
  employees,
  clients,
  clientLocations = [],
  onSave,
  onDelete,
  onCancel,
  open,
  onOpenChange,
  onSaveChanges
}) => {
  const [formData, setFormData] = useState<TaskFormData>(initializeFormData(task));
  const [assignmentType, setAssignmentType] = useState<AssignmentType>(getInitialAssignmentType(task));
  const [locationType, setLocationType] = useState<LocationType>(getInitialLocationType(task));

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData(initializeFormData(task));
      setAssignmentType(getInitialAssignmentType(task));
      setLocationType(getInitialLocationType(task));
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;

    const updatedTask: Partial<Task> = {
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    // Handle assignment based on selected type
    if (assignmentType === 'individual') {
      updatedTask.assignedTo = formData.assignedTo;
      updatedTask.crew = undefined;
      updatedTask.crewId = undefined;
    } else if (assignmentType === 'crew') {
      updatedTask.assignedTo = undefined;
      
      // Get crew members' names
      const selectedCrew = crews.find(crew => crew.id === formData.assignedCrew);
      if (selectedCrew) {
        updatedTask.crew = selectedCrew.members.map(memberId => {
          const employee = employees.find(emp => emp.id === memberId);
          return employee ? employee.name : '';
        }).filter(name => name !== '');
        updatedTask.crewId = formData.assignedCrew;
      }
    }

    // Handle location based on selected type
    if (locationType === 'custom') {
      updatedTask.location = formData.location;
      updatedTask.clientId = undefined;
      updatedTask.clientLocationId = undefined;
    } else if (locationType === 'client') {
      const client = clients.find(c => c.id === formData.clientId);
      const location = clientLocations.find(l => l.id === formData.clientLocationId);
      
      if (client && location) {
        updatedTask.location = `${client.name} - ${location.name}`;
        updatedTask.clientId = formData.clientId;
        updatedTask.clientLocationId = formData.clientLocationId;
      }
    }

    // Use the appropriate save method based on what was provided
    if (onSaveChanges && task.id) {
      onSaveChanges(task.id, updatedTask);
    } else {
      onSave(updatedTask, !task.id);
    }
    
    // Close dialog if needed
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    if (!task || !task.id) return;
    onDelete(task.id);
    
    // Close dialog if needed
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Pencil className="h-4 w-4 text-blue-500" />
          <h3 className="text-lg font-medium">Edit Task</h3>
        </div>
      </div>

      <Tabs defaultValue="basicInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="basicInfo" className="text-base">Basic Info</TabsTrigger>
          <TabsTrigger value="assignment" className="text-base">Assignment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basicInfo" className="space-y-6 mt-0">
          <BasicInfoTab
            task={task}
            formData={formData}
            setFormData={setFormData}
            locationType={locationType}
            setLocationType={setLocationType}
            clients={clients}
            clientLocations={clientLocations}
          />
        </TabsContent>
        
        <TabsContent value="assignment" className="space-y-6 mt-0">
          <AssignmentTab 
            formData={formData}
            setFormData={setFormData}
            assignmentType={assignmentType}
            setAssignmentType={setAssignmentType}
            crews={crews}
            employees={employees}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="gap-1"
        >
          <X className="h-4 w-4" /> Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          className="gap-1"
        >
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

export default TaskEditDialog;
