
import React, { useEffect } from 'react';
import { Task, Crew, DragItem } from '../ScheduleTypes';
import { toast } from 'sonner';
import { format } from 'date-fns';
import CalendarCard from './CalendarCard';
import TasksCard from './TasksCard';
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
  // Get global calendar date from AppContext
  const { calendarDate, setCalendarDate } = useAppContext();
  
  // Sync local state with global state on mount and when global state changes
  useEffect(() => {
    if (calendarDate) {
      onSelectDate(calendarDate);
    }
  }, [calendarDate, onSelectDate]);
  
  // Update global state when local state changes
  useEffect(() => {
    setCalendarDate(selectedDate);
  }, [selectedDate, setCalendarDate]);
  
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
  
  // Handle moving a task to a new date with toast notification
  const handleMoveTask = (taskId: string, date: Date) => {
    if (onMoveTask) {
      // Find the task to get its title
      const task = tasks.find(t => t.id === taskId);
      const taskTitle = task?.title || 'Task';
      
      // Move the task
      onMoveTask(taskId, date);
      
      // Show success message
      toast.success(`Task rescheduled to ${format(date, 'MMMM d')}`, {
        description: taskTitle
      });
    }
  };

  // Handle dropping other item types (employee, crew, client)
  const handleItemDrop = (item: DragItem, date: Date) => {
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
      
      // Create an employee-related task
      // This simulates what would happen if we added a real task for this employee
      if (onMoveTask) {
        const newTaskId = `temp-employee-${item.id}-${Date.now()}`;
        const newTask: Task = {
          id: newTaskId,
          title: taskTitle,
          description: `Meet with ${employeeName}`,
          date: date,
          completed: false,
          assignedTo: employeeName,
          // Add more task properties as needed
        };
        
        // Use setTimeout to simulate async task creation
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
      
      // Create a crew-related task
      // This simulates what would happen if we added a real task for this crew
      if (onMoveTask) {
        const newTaskId = `temp-crew-${item.id}-${Date.now()}`;
        const newTask: Task = {
          id: newTaskId,
          title: taskTitle,
          description: `Team activity with ${crewName} crew`,
          date: date,
          completed: false,
          crew: crewName,
          // Add more task properties as needed
        };
        
        // Use setTimeout to simulate async task creation
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
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <CalendarCard 
        tasks={tasks}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        onMoveTask={handleMoveTask}
        onItemDrop={handleItemDrop}
      />
      
      <TasksCard
        tasks={tasks}
        selectedDate={selectedDate}
        onToggleTaskCompletion={onToggleTaskCompletion}
        crews={crews}
        onAddNewTask={onAddNewTask}
        onEditTask={onEditTask}
      />
    </div>
  );
};

export default TaskCalendarView;
