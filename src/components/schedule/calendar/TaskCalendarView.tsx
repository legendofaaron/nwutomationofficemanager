
import React, { useEffect, useCallback } from 'react';
import { Task, Crew, DragItem } from '../ScheduleTypes';
import { toast } from 'sonner';
import { format } from 'date-fns';
import CalendarCard from './CalendarCard';
import TasksCard from './TasksCard';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { useAppContext } from '@/context/AppContext';

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

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onToggleTaskCompletion,
  crews,
  onAddNewTask,
  onMoveTask,
  onEditTask
}) => {
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
  
  // Handle date selection with a single click
  const handleSelectDate = useCallback((date: Date | undefined) => {
    if (date) {
      // Update both local and global state with one call
      setDate(date);
      // Let the parent component know about the change
      onSelectDate(date);
    }
  }, [onSelectDate, setDate]);
  
  // Handle moving a task to a new date with toast notification
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
      toast.success(`Task rescheduled to ${format(date, 'MMMM d')}`, {
        description: taskTitle
      });
    }
  }, [onMoveTask, tasks, setDate]);

  // Handle dropping other item types (employee, crew, client)
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
      toast.info(`Employee dropped on ${format(date, 'MMMM d')}`, {
        description: `Creating task for ${employeeName}`,
        duration: 2000
      });
      
      // Create an employee-related task simulation
      if (onMoveTask) {
        // Existing simulation code...
        setTimeout(() => {
          toast.success(`Task created for ${employeeName}`, {
            description: `Scheduled for ${format(date, 'MMMM d')}`,
          });
        }, 500);
      }
    } else if (item.type === 'crew') {
      // Get crew name from data
      const crewName = item.data?.name || 'Crew';
      
      // Create task title
      const taskTitle = `Team activity with ${crewName}`;
      
      // Show temporary feedback toast
      toast.info(`Crew dropped on ${format(date, 'MMMM d')}`, {
        description: `Creating task for ${crewName} crew`,
        duration: 2000
      });
      
      // Create a crew-related task simulation
      if (onMoveTask) {
        // Existing simulation code...
        setTimeout(() => {
          toast.success(`Team task created for ${crewName}`, {
            description: `Scheduled for ${format(date, 'MMMM d')}`,
          });
        }, 500);
      }
    } else if (item.type === 'client') {
      toast.info(`Client dropped on ${format(date, 'MMMM d')}`, {
        description: `${item.data.name || 'Client'} - Create a new task for this client?`
      });
    } else if (item.type === 'task') {
      // If we're dropping a task, use the move task handler
      if (onMoveTask && item.id) {
        handleMoveTask(item.id, date);
      }
    }
  }, [onSelectDate, setDate, onMoveTask, handleMoveTask, setCalendarDate]);

  return (
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
  );
};

export default TaskCalendarView;
