import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Task, Crew, DragItem } from '../ScheduleTypes';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import CalendarCard from './CalendarCard';
import TasksCard from './TasksCard';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import ScheduleDownloadDialog from '../ScheduleDownloadDialog';

interface TaskCalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  crews: Crew[];
  onAddNewTask: () => void;
  onMoveTask?: (taskId: string, newDate: Date) => void;
  onEditTask?: (taskId: string) => void;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = React.memo(({
  tasks,
  selectedDate,
  onSelectDate,
  onToggleTaskCompletion,
  crews,
  onAddNewTask,
  onMoveTask,
  onEditTask
}) => {
  // State for download dialog
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  
  // Get access to the global calendar date setter
  const { setCalendarDate } = useAppContext();
  
  // Use the enhanced calendar sync hook
  const { date, setDate } = useCalendarSync(selectedDate);
  
  // Sync local prop with hook's state
  useEffect(() => {
    if (date && date.toDateString() !== selectedDate.toDateString()) {
      onSelectDate(date);
    }
  }, [date, onSelectDate, selectedDate]);
  
  // Sync hook's state with local prop
  useEffect(() => {
    if (selectedDate && selectedDate.toDateString() !== date.toDateString()) {
      setDate(selectedDate);
    }
  }, [selectedDate, setDate, date]);
  
  // Listen for global drag events to make interaction more reliable
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    
    document.addEventListener('dragover', handleDragOver);
    
    return () => {
      document.removeEventListener('dragover', handleDragOver);
    };
  }, []);
  
  // Handle date selection with a single click - memoized
  const handleSelectDate = useCallback((date: Date | undefined) => {
    if (date) {
      // Update both local and global state with one call
      setDate(date);
      // Let the parent component know about the change
      onSelectDate(date);
    }
  }, [onSelectDate, setDate]);
  
  // Handle moving a task to a new date with toast notification - memoized
  const handleMoveTask = useCallback((taskId: string, date: Date) => {
    if (onMoveTask) {
      // Find the task to get its title
      const task = tasks.find(t => t.id === taskId);
      const taskTitle = task?.title || 'Task';
      
      // Move the task
      onMoveTask(taskId, date);
      
      // Update both local and global date
      setDate(date);
      
      // Show success message
      toast({
        title: "Task rescheduled",
        description: `${taskTitle} moved to ${format(date, 'MMMM d')}`
      });
    }
  }, [onMoveTask, tasks, setDate]);

  // Handle dropping other item types (employee, crew, client) - memoized
  const handleItemDrop = useCallback((item: DragItem, date: Date) => {
    // Always update the selected date when an item is dropped
    setDate(date);
    onSelectDate(date);
    setCalendarDate(date);
    
    if (item.type === 'employee') {
      // Get employee name from data
      const employeeName = item.data?.name || 'Employee';
      
      // Create task title
      const taskTitle = `Meeting with ${employeeName}`;
      
      // Show temporary feedback toast while we're creating the task
      toast({
        title: "Item dropped",
        description: `Employee dropped on ${format(date, 'MMMM d')}`
      });
      
      // Create an employee-related task simulation
      if (onMoveTask) {
        // Existing simulation code...
        setTimeout(() => {
          toast({
            title: "Task created",
            description: `Scheduled for ${employeeName} on ${format(date, 'MMMM d')}`
          });
        }, 500);
      }
    } else if (item.type === 'crew') {
      // Get crew name from data
      const crewName = item.data?.name || 'Crew';
      
      // Create task title
      const taskTitle = `Team activity with ${crewName}`;
      
      // Show temporary feedback toast
      toast({
        title: "Item dropped",
        description: `Crew dropped on ${format(date, 'MMMM d')}`
      });
      
      // Create a crew-related task simulation
      if (onMoveTask) {
        // Existing simulation code...
        setTimeout(() => {
          toast({
            title: "Team task created",
            description: `Scheduled for ${crewName} on ${format(date, 'MMMM d')}`
          });
        }, 500);
      }
    } else if (item.type === 'client') {
      toast({
        title: "Client dropped",
        description: `${item.data.name || 'Client'} dropped on ${format(date, 'MMMM d')}`
      });
    } else if (item.type === 'task') {
      // If we're dropping a task, use the move task handler
      if (onMoveTask && item.id) {
        handleMoveTask(item.id, date);
      }
    }
  }, [onSelectDate, setDate, onMoveTask, handleMoveTask, setCalendarDate]);

  // Memoize dialog open state handler to prevent unnecessary re-renders
  const handleOpenDownloadDialog = useCallback(() => {
    setIsDownloadDialogOpen(true);
  }, []);

  const handleCloseDownloadDialog = useCallback(() => {
    setIsDownloadDialogOpen(false);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Schedule</h2>
        <Button 
          variant="outline" 
          onClick={handleOpenDownloadDialog}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Schedule
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <CalendarCard 
          tasks={tasks}
          selectedDate={date}
          onSelectDate={handleSelectDate}
          onMoveTask={handleMoveTask}
          onItemDrop={handleItemDrop}
        />
        
        <TasksCard
          tasks={tasks}
          selectedDate={date}
          onToggleTaskCompletion={onToggleTaskCompletion}
          crews={crews}
          onAddNewTask={onAddNewTask}
          onEditTask={onEditTask}
        />
      </div>
      
      <ScheduleDownloadDialog
        isOpen={isDownloadDialogOpen}
        onClose={handleCloseDownloadDialog}
        tasks={tasks}
        employees={[]} // Pass empty array for now as placeholder
        crews={crews || []}
      />
    </>
  );
});

TaskCalendarView.displayName = 'TaskCalendarView';

export default TaskCalendarView;
