
import { useState } from 'react';
import { Task, TaskFormData, AssignmentType, LocationType } from '../ScheduleTypes';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';

interface UseTaskDialogsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedDate: Date;
}

export const useTaskDialogs = ({ tasks, setTasks, selectedDate }: UseTaskDialogsProps) => {
  const { crews, employees, clients, clientLocations } = useAppContext();
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [teamEventDialogOpen, setTeamEventDialogOpen] = useState(false);
  const [droppedCrewId, setDroppedCrewId] = useState<string | null>(null);
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('individual');
  const [locationType, setLocationType] = useState<LocationType>('custom');
  const [showCrewPanel, setShowCrewPanel] = useState(false);
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    assignedTo: '',
    assignedCrew: '',
    startTime: '',
    endTime: '',
    location: '',
    clientId: '',
    clientLocationId: ''
  });

  const resetFormData = () => {
    setFormData({ 
      title: '', 
      assignedTo: '', 
      assignedCrew: '', 
      startTime: '', 
      endTime: '', 
      location: '',
      clientId: '',
      clientLocationId: ''
    });
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (formData.title && formData.startTime && formData.endTime) {
      const task: Task = {
        id: Date.now().toString(),
        title: formData.title,
        date: selectedDate,
        completed: false,
        startTime: formData.startTime,
        endTime: formData.endTime
      };
      
      // Handle assignment based on selected type
      if (assignmentType === 'individual' && formData.assignedTo) {
        task.assignedTo = formData.assignedTo;
      } else if (assignmentType === 'crew' && formData.assignedCrew) {
        // Get crew members' names
        const selectedCrew = crews.find(crew => crew.id === formData.assignedCrew);
        if (selectedCrew) {
          task.crew = selectedCrew.members.map(memberId => {
            const employee = employees.find(emp => emp.id === memberId);
            return employee ? employee.name : '';
          }).filter(name => name !== '');
          task.crewId = formData.assignedCrew;
          task.crewName = selectedCrew.name;
        }
      }
      
      // Handle location based on selected type
      if (locationType === 'custom' && formData.location) {
        task.location = formData.location;
      } else if (locationType === 'client' && formData.clientId && formData.clientLocationId) {
        const client = clients.find(c => c.id === formData.clientId);
        const location = clientLocations.find(l => l.id === formData.clientLocationId);
        
        if (client && location) {
          task.location = `${client.name} - ${location.name}`;
          task.clientId = formData.clientId;
          task.clientLocationId = formData.clientLocationId;
        }
      }
      
      setTasks([...tasks, task]);
      resetFormData();
      setIsTaskDialogOpen(false);
      toast.success("Task scheduled successfully");
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleOpenAddTaskDialog = (type: 'individual' | 'crew' = 'individual') => {
    // Reset form data
    resetFormData();
    
    // Pre-fill with default times
    setFormData({
      ...formData,
      startTime: '09:00',
      endTime: '10:00'
    });
    
    // Set assignment type based on button clicked
    setAssignmentType(type);
    
    // Open the dialog
    setIsTaskDialogOpen(true);
  };

  const handleOpenCrewVisitDialog = () => {
    resetFormData();
    
    setFormData({
      ...formData,
      title: 'Client Site Visit',
      startTime: '09:00',
      endTime: '16:00'
    });
    
    setAssignmentType('crew');
    setLocationType('client');
    setIsTaskDialogOpen(true);
  };

  // Handle editing a task
  const handleEditTask = (taskId: string) => {
    const taskToEdit = tasks.find(t => t.id === taskId);
    if (taskToEdit) {
      setCurrentEditTask(taskToEdit);
      setIsEditDialogOpen(true);
    }
  };

  // Handle creating team event from dropped crew
  const handleCreateTeamEvent = () => {
    handleAddTask();
    setTeamEventDialogOpen(false);
    setDroppedCrewId(null);
  };

  return {
    currentEditTask,
    setCurrentEditTask,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isTaskDialogOpen,
    setIsTaskDialogOpen,
    teamEventDialogOpen,
    setTeamEventDialogOpen,
    droppedCrewId,
    setDroppedCrewId,
    assignmentType,
    setAssignmentType,
    locationType,
    setLocationType,
    showCrewPanel,
    setShowCrewPanel,
    formData,
    setFormData,
    resetFormData,
    handleAddTask,
    handleOpenAddTaskDialog,
    handleOpenCrewVisitDialog,
    handleEditTask,
    handleCreateTeamEvent
  };
};
