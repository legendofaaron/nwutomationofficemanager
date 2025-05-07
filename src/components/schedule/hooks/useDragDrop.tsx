import { useCallback } from 'react';
import { Task } from '../ScheduleTypes';
import { toast } from 'sonner';
import { useDragDrop as useContextDragDrop } from '../DragDropContext';

interface UseDragDropOptions<T = any> {
  onItemDrop?: (data: T, target: any) => void;
  onCrewDrop?: (crewId: string, targetData?: any) => void;
  onTaskMove?: (taskId: string, date: Date) => void;
  dropZoneClassName?: string;
  dropZoneActiveClassName?: string;
  acceptTypes?: string[];
  // Make tasks optional to avoid type errors
  tasks?: Task[];
  // Add these properties to fix the build error
  selectedDate?: Date;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  formData?: any;
  setDroppedCrewId?: React.Dispatch<React.SetStateAction<string | null>>;
  setAssignmentType?: React.Dispatch<React.SetStateAction<'individual' | 'crew'>>;
  setTeamEventDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  // Add the setTasks property to fix the build error
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const useDragDrop = <T extends Record<string, any> = any>({
  onItemDrop,
  onCrewDrop,
  onTaskMove,
  dropZoneClassName = "schedule-drop-zone",
  dropZoneActiveClassName = "drag-over",
  acceptTypes = ['task', 'crew'],
  tasks = [],
  selectedDate,
  setFormData,
  formData,
  setDroppedCrewId,
  setAssignmentType,
  setTeamEventDialogOpen,
  setTasks
}: UseDragDropOptions<T> = {}) => {
  // Get context from DragDropContext
  const contextDragDrop = useContextDragDrop();
  
  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add classes for drop zone visual feedback
    if (e.currentTarget.classList.contains(dropZoneClassName)) {
      e.currentTarget.classList.add(dropZoneActiveClassName);
    }
  }, [dropZoneClassName, dropZoneActiveClassName]);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual feedback classes
    if (e.currentTarget.classList.contains(dropZoneClassName)) {
      e.currentTarget.classList.remove(dropZoneActiveClassName);
    }
  }, [dropZoneClassName, dropZoneActiveClassName]);

  const handleDrop = useCallback((e: React.DragEvent, targetData?: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual feedback
    if (e.currentTarget.classList.contains(dropZoneClassName)) {
      e.currentTarget.classList.remove(dropZoneActiveClassName);
    }
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const dragData = JSON.parse(data);
        
        // Check if the dragged item type is in the accepted types
        if (!acceptTypes.includes(dragData.type)) {
          return;
        }
        
        // Handle crew drop
        if (dragData.type === 'crew' && onCrewDrop) {
          onCrewDrop(dragData.id, targetData);
          
          toast.success(`Creating event for ${dragData.name} crew`, {
            description: "Fill in the details to schedule this team event"
          });
        } 
        // Handle employee drops for scheduling
        else if (dragData.type === 'employee' && setFormData && setAssignmentType && setTeamEventDialogOpen && selectedDate) {
          // Pre-fill form data for the employee task
          setFormData({
            ...formData,
            title: `Task for ${dragData.name}`,
            assignedTo: dragData.id,
            startTime: '09:00',
            endTime: '10:00'
          });
          
          setAssignmentType('individual');
          setTeamEventDialogOpen(true);
          
          toast.success(`Creating task for ${dragData.name}`, {
            description: "Fill in the details to schedule this employee's task"
          });
        }
        // Handle crew drop for scheduling a team event
        else if (dragData.type === 'crew' && setDroppedCrewId && setFormData && setTeamEventDialogOpen && selectedDate) {
          setDroppedCrewId(dragData.id);
          
          // Pre-fill form data for the crew event
          setFormData({
            ...formData,
            title: `${dragData.name} Team Event`,
            assignedCrew: dragData.id,
            startTime: '09:00',
            endTime: '16:00'
          });
          
          setTeamEventDialogOpen(true);
        }
        // Handle task drop for reordering or moving to a different day
        else if (dragData.type === 'task') {
          // If we have a specific handler for task moves and the target is a date
          if (onTaskMove && targetData instanceof Date) {
            onTaskMove(dragData.id, targetData);
          } 
          // Generic item drop handler
          else if (onItemDrop) {
            onItemDrop(dragData as T, targetData);
          }
        }
        // Generic handler for any other type
        else if (onItemDrop) {
          onItemDrop(dragData as T, targetData);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error("Error processing the dragged item");
    }
  }, [dropZoneClassName, dropZoneActiveClassName, acceptTypes, onCrewDrop, onTaskMove, onItemDrop, formData, selectedDate, setFormData, setAssignmentType, setTeamEventDialogOpen, setDroppedCrewId]);

  const handleDragStart = useCallback((data: any, e: React.DragEvent) => {
    contextDragDrop.setIsDragging(true);
    
    if (data.id) {
      contextDragDrop.setDraggedItemId(data.id);
    }
    
    if (data.type) {
      contextDragDrop.setDraggedItemType(data.type);
    }
    
    contextDragDrop.setDraggedItemData(data);
    
    // Set data transfer for native HTML5 drag and drop
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  }, [contextDragDrop]);
  
  const handleDragEnd = useCallback(() => {
    contextDragDrop.setIsDragging(false);
    contextDragDrop.setDraggedItemId(null);
    contextDragDrop.setDraggedItemType(null);
    contextDragDrop.setDraggedItemData(null);
  }, [contextDragDrop]);

  return {
    ...contextDragDrop,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragStart,
    handleDragEnd
  };
};
