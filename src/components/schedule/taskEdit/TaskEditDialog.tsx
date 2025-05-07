
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Task, Employee, Crew, Client, ClientLocation, TaskEditDialogProps } from '../ScheduleTypes';
import BasicInfoTab from './BasicInfoTab';
import AssignmentTab from './AssignmentTab';

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  task,
  employees,
  crews,
  clients,
  clientLocations = [],
  onSaveChanges,
  onDelete,
  onCancel
}) => {
  // Local state for task data (to avoid mutating props)
  const [taskData, setTaskData] = useState<Task>({
    ...task
  });
  
  // Track if this is a new task
  const isNewTask = !task.title || task.title === 'New Task';

  // Update state when form fields change
  const handleChange = (field: keyof Task, value: any) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle crew selection and update crew members
  const handleCrewChange = (crewId: string | undefined) => {
    if (!crewId) {
      setTaskData(prev => ({
        ...prev,
        crewId: undefined,
        crewName: undefined,
        crew: undefined
      }));
      return;
    }

    const selectedCrew = crews.find(c => c.id === crewId);
    if (selectedCrew) {
      setTaskData(prev => ({
        ...prev,
        crewId,
        crewName: selectedCrew.name,
        crew: selectedCrew.members
      }));
    }
  };

  // Handle client selection
  const handleClientChange = (clientId: string | undefined) => {
    if (!clientId) {
      setTaskData(prev => ({
        ...prev,
        clientId: undefined,
        clientName: undefined,
        location: undefined
      }));
      return;
    }

    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setTaskData(prev => ({
        ...prev,
        clientId,
        clientName: selectedClient.name
      }));
    }
  };

  // Handle form submission
  const handleSave = () => {
    if (onSaveChanges) {
      onSaveChanges(taskData, isNewTask);
    }
  };

  // Handle task deletion
  const handleDelete = () => {
    if (onDelete && task.id) {
      onDelete(task.id);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isNewTask ? 'Add New Task' : 'Edit Task'}</DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="basic" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="py-4">
          <BasicInfoTab 
            task={taskData} 
            onTaskChange={handleChange} 
          />
        </TabsContent>
        
        <TabsContent value="assignment" className="py-4">
          <AssignmentTab
            task={taskData}
            employees={employees}
            crews={crews}
            clients={clients}
            clientLocations={clientLocations}
            onTaskChange={handleChange}
            onCrewChange={handleCrewChange}
            onClientChange={handleClientChange}
          />
        </TabsContent>
      </Tabs>

      <DialogFooter className="gap-2 sm:gap-0">
        {!isNewTask && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            className="flex-1 sm:flex-none"
          >
            Delete
          </Button>
        )}
        <div className="flex gap-2 flex-1 sm:justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
          >
            {isNewTask ? 'Create' : 'Save'}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};

export default TaskEditDialog;
