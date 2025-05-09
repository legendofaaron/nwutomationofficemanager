
import { useState, useCallback } from 'react';
import { Task, LocationType, AssignmentType, TaskFormData } from '../ScheduleTypes';
import { toast } from 'sonner';

interface UseDragDropProps {
  tasks?: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedDate?: Date;
  setFormData?: React.Dispatch<React.SetStateAction<TaskFormData>>;
  formData?: TaskFormData;
  setDroppedCrewId?: React.Dispatch<React.SetStateAction<string | null>>;
  setDroppedClientId?: React.Dispatch<React.SetStateAction<string | null>>;
  setAssignmentType?: React.Dispatch<React.SetStateAction<AssignmentType>>;
  setLocationType?: React.Dispatch<React.SetStateAction<LocationType>>;
  setTeamEventDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setClientVisitDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  acceptTypes?: string[];
  onTaskMove?: (taskId: string, date: Date) => void;
}

export const useDragDrop = ({
  tasks,
  setTasks,
  selectedDate,
  setFormData,
  formData,
  setDroppedCrewId,
  setDroppedClientId,
  setAssignmentType,
  setLocationType,
  setTeamEventDialogOpen,
  setClientVisitDialogOpen,
  acceptTypes = ['task', 'employee', 'crew', 'client'],
  onTaskMove
}: UseDragDropProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Handle drag over event with debounce
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set effectAllowed to indicate valid drop target
    e.dataTransfer.dropEffect = 'move';
    
    // Only set drag over state if it's not already set
    if (!isDragOver) {
      setIsDragOver(true);
      
      // Add drop target indicator styling
      const target = e.currentTarget as HTMLElement;
      if (target) {
        target.classList.add('drag-over');
      }
    }
  }, [isDragOver]);
  
  // Handle drag leave event
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    // Only handle drag leave if it's leaving the container (not entering a child)
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    
    // Reset drag over state
    setIsDragOver(false);
    
    // Remove drop target indicator styling
    const target = e.currentTarget as HTMLElement;
    if (target) {
      target.classList.remove('drag-over');
    }
  }, []);
  
  // Handle drag start event for dragging tasks
  const handleDragStart = useCallback((data: any, event: React.DragEvent) => {
    if (!event.dataTransfer) return;
    
    // Set the drag data
    event.dataTransfer.setData('application/json', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
    
    // Create custom drag image
    const dragPreview = document.createElement('div');
    dragPreview.className = 'task-drag-preview';
    dragPreview.textContent = data.title || 'Task';
    document.body.appendChild(dragPreview);
    
    // Set the drag image
    event.dataTransfer.setDragImage(dragPreview, 10, 10);
    
    // Remove the drag preview element after a delay
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  }, []);
  
  // Handle drag end event
  const handleDragEnd = useCallback(() => {
    // Clean up any drag state or UI changes
    const dropZone = document.querySelector('.schedule-drop-zone');
    if (dropZone) {
      dropZone.classList.remove('drag-over');
    }
  }, []);
  
  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset drag over state
    setIsDragOver(false);
    
    // Remove drop target indicator styling
    const target = e.currentTarget as HTMLElement;
    if (target) {
      target.classList.remove('drag-over');
    }
    
    // Get the dropped data
    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData) return;
      
      const data = JSON.parse(rawData);
      const dropType = data.type;
      
      // Check if the drop type is accepted
      if (!acceptTypes.includes(dropType)) return;
      
      // Handle different drop types
      switch (dropType) {
        case 'employee':
          if (setFormData && setAssignmentType) {
            // Set form data for employee assignment
            setFormData(prev => ({
              ...prev,
              title: `Task for ${data.name}`,
              assignedTo: data.id
            }));
            // Set assignment type to individual
            setAssignmentType('individual');
            // Open dialog
            if (setTeamEventDialogOpen) {
              setTeamEventDialogOpen(true);
            }
          }
          break;
        
        case 'crew':
          if (setFormData && setDroppedCrewId && setAssignmentType) {
            // Set form data for crew assignment
            setFormData(prev => ({
              ...prev,
              title: `Team Task for ${data.name}`,
              assignedCrew: data.id
            }));
            // Set dropped crew ID
            setDroppedCrewId(data.id);
            // Set assignment type to crew
            setAssignmentType('crew');
            // Open dialog
            if (setTeamEventDialogOpen) {
              setTeamEventDialogOpen(true);
            }
          }
          break;
        
        case 'client':
          if (setFormData && setDroppedClientId && setLocationType) {
            // Set form data for client assignment
            setFormData(prev => ({
              ...prev,
              title: `Visit ${data.name}`,
              clientId: data.id
            }));
            // Set dropped client ID
            setDroppedClientId(data.id);
            // Set location type to client
            setLocationType('client');
            // Open dialog
            if (setClientVisitDialogOpen) {
              setClientVisitDialogOpen(true);
            }
          }
          break;
        
        case 'task':
          // Move the task to the selected date if onTaskMove is provided
          if (onTaskMove && data.id && selectedDate) {
            onTaskMove(data.id, selectedDate);
            toast.success(`Task moved to ${selectedDate.toLocaleDateString()}`);
          }
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error('Could not process the dropped item');
    }
  }, [
    acceptTypes,
    selectedDate,
    setFormData,
    setDroppedCrewId, 
    setDroppedClientId,
    setAssignmentType,
    setLocationType,
    setTeamEventDialogOpen,
    setClientVisitDialogOpen,
    onTaskMove
  ]);
  
  return {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDragStart,
    handleDragEnd,
    handleDrop
  };
};
