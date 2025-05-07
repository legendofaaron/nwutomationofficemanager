
import { Task } from '../ScheduleTypes';
import { toast } from 'sonner';

interface UseDragDropProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedDate: Date;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
  setDroppedCrewId: React.Dispatch<React.SetStateAction<string | null>>;
  setAssignmentType: React.Dispatch<React.SetStateAction<'individual' | 'crew'>>;
  setTeamEventDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDragDrop = ({
  tasks,
  setTasks,
  selectedDate,
  setFormData,
  formData,
  setDroppedCrewId,
  setAssignmentType,
  setTeamEventDialogOpen
}: UseDragDropProps) => {
  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add classes for drop zone visual feedback
    if (e.currentTarget.classList.contains('schedule-drop-zone')) {
      e.currentTarget.classList.add('drag-over');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual feedback classes
    if (e.currentTarget.classList.contains('schedule-drop-zone')) {
      e.currentTarget.classList.remove('drag-over');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual feedback
    if (e.currentTarget.classList.contains('schedule-drop-zone')) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const dragData = JSON.parse(data);
        
        // Handle crew drop
        if (dragData.type === 'crew') {
          setDroppedCrewId(dragData.id);
          
          // Pre-fill the form with crew data
          setFormData({
            ...formData,
            title: `${dragData.name} Team Meeting`,
            assignedCrew: dragData.id,
            assignedTo: '',
            startTime: '09:00',
            endTime: '10:00'
          });
          
          // Set assignment type to crew
          setAssignmentType('crew');
          setTeamEventDialogOpen(true);
          
          toast.success(`Creating event for ${dragData.name} crew`, {
            description: "Fill in the details to schedule this team event"
          });
        }
        
        // Handle task drop for reordering or moving to a different day
        else if (dragData.type === 'task') {
          const taskId = dragData.id;
          const task = tasks.find(t => t.id === taskId);
          
          if (task && task.date.toDateString() !== selectedDate.toDateString()) {
            // Update the task date
            setTasks(tasks.map(t => 
              t.id === taskId 
                ? { ...t, date: selectedDate } 
                : t
            ));
            
            toast.success(`Task moved to ${selectedDate.toLocaleDateString()}`, {
              description: task.title
            });
          }
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error("Error processing the dragged item");
    }
  };

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};
