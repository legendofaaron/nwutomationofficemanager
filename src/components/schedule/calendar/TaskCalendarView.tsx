import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Task, Crew, DragItem } from '../ScheduleTypes';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import CalendarCard from './CalendarCard';
import TasksCard from './TasksCard';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import ScheduleDownloadDialog from '../ScheduleDownloadDialog';
import { useScheduleState } from '@/hooks/useScheduleState';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

  // Get access to the global calendar date setter and employees data
  const {
    setCalendarDate
  } = useAppContext();

  // Get employees from useScheduleState
  const {
    employees,
    handleAddNewTask
  } = useScheduleState();

  // Use the enhanced calendar sync hook
  const {
    date,
    setDate,
    createEventOnDate
  } = useCalendarSync(selectedDate);

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
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
    };
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Handle date selection with a single click - memoized
  const handleSelectDate = useCallback((date: Date | undefined) => {
    if (date) {
      // Update both local and global state with one call
      setDate(date);
      // Let the parent component know about the change
      onSelectDate(date);
      // Also update global context
      setCalendarDate(date);
    }
  }, [onSelectDate, setDate, setCalendarDate]);

  // Navigate to previous month
  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  }, [date, setDate]);

  // Navigate to next month
  const handleNextMonth = useCallback(() => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  }, [date, setDate]);

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
      setCalendarDate(date);

      // Show success message
      toast({
        title: "Task rescheduled",
        description: `${taskTitle} moved to ${format(date, 'MMMM d')}`,
        variant: "success"
      });
    }
  }, [onMoveTask, tasks, setDate, setCalendarDate]);

  // Handle dropping other item types (employee, crew, client) - direct creation
  const handleItemDrop = useCallback((item: DragItem, date: Date) => {
    // Always update the selected date when an item is dropped
    setDate(date);
    onSelectDate(date);
    setCalendarDate(date);
    if (item.type === 'employee') {
      // Get employee name from data
      const employeeName = item.data?.name || 'Employee';

      // Create task directly without showing dialog
      const newTask = {
        id: `task-${Date.now()}`,
        title: `${employeeName} Task`,
        date: date,
        completed: false,
        assignedTo: item.id,
        startTime: '09:00',
        endTime: '10:00'
      };

      // Add the new task using the schedule state handler
      handleAddNewTask(newTask);

      // Show feedback toast
      toast({
        title: "Employee scheduled",
        description: `${employeeName} scheduled for ${format(date, 'MMMM d')}`,
        variant: "success"
      });
    } else if (item.type === 'crew') {
      // Get crew name from data
      const crewName = item.data?.name || 'Crew';

      // Create task directly without showing dialog
      const newTask = {
        id: `task-${Date.now()}`,
        title: `${crewName} Assignment`,
        date: date,
        completed: false,
        crewId: item.id,
        crewName: crewName,
        startTime: '09:00',
        endTime: '10:00'
      };

      // Add the new task using the schedule state handler
      handleAddNewTask(newTask);

      // Show feedback toast
      toast({
        title: "Crew scheduled",
        description: `${crewName} scheduled for ${format(date, 'MMMM d')}`,
        variant: "success"
      });
    } else if (item.type === 'client') {
      toast({
        title: "Client scheduled",
        description: `${item.data.name || 'Client'} scheduled for ${format(date, 'MMMM d')}`,
        variant: "success"
      });
      setTimeout(() => {
        onAddNewTask();
      }, 100);
    } else if (item.type === 'task') {
      // If we're dropping a task, use the move task handler
      if (onMoveTask && item.id) {
        handleMoveTask(item.id, date);
      }
    }
  }, [onSelectDate, setDate, onMoveTask, handleMoveTask, setCalendarDate, onAddNewTask, handleAddNewTask]);

  // Memoize dialog open state handler to prevent unnecessary re-renders
  const handleOpenDownloadDialog = useCallback(() => {
    setIsDownloadDialogOpen(true);
  }, []);
  const handleCloseDownloadDialog = useCallback(() => {
    setIsDownloadDialogOpen(false);
  }, []);
  const pendingTasks = useMemo(() => {
    return tasks.filter(task => !task.completed && task.date.toDateString() === selectedDate.toDateString()).length;
  }, [tasks, selectedDate]);
  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.completed && task.date.toDateString() === selectedDate.toDateString()).length;
  }, [tasks, selectedDate]);
  return <>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Schedule</h2>
          <Button variant="outline" onClick={handleOpenDownloadDialog} className="flex items-center gap-2 transition-colors">
            <Download className="h-4 w-4" />
            Export Schedule
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Main Calendar - 5 columns */}
          <Card className="lg:col-span-5 overflow-hidden shadow-sm border border-border/50">
            <CardHeader className="bg-card border-b border-border/30 flex flex-row justify-between items-center py-3 px-4 h-14">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Calendar</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 rounded-full">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Month</span>
                </Button>
                
                <span className="text-sm font-medium min-w-24 text-center">
                  {format(date, 'MMMM yyyy')}
                </span>
                
                <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Month</span>
                </Button>
              </div>
              
              <Button onClick={onAddNewTask} variant="outline" size="sm" className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </CardHeader>
            
            
          </Card>
          
          {/* Task List - 2 columns */}
          <Card className="lg:col-span-2 shadow-sm border border-border/50">
            <CardHeader className="bg-card border-b border-border/30 flex flex-row justify-between items-center py-3 px-4 h-14">
              <div className="text-sm font-medium">
                {format(selectedDate, 'MMMM d, yyyy')}
              </div>
              
              <Button onClick={onAddNewTask} size="sm" className="h-7 w-7 p-0 rounded-full">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Task</span>
              </Button>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="flex gap-3 mb-4">
                <Badge variant="outline" className="bg-primary/5">
                  {pendingTasks} Pending
                </Badge>
                
                <Badge variant="outline" className="bg-green-500/5">
                  {completedTasks} Completed
                </Badge>
              </div>
              
              <TasksCard tasks={tasks} selectedDate={date} onToggleTaskCompletion={onToggleTaskCompletion} crews={crews} onAddNewTask={onAddNewTask} onEditTask={onEditTask} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ScheduleDownloadDialog isOpen={isDownloadDialogOpen} onClose={handleCloseDownloadDialog} tasks={tasks} employees={employees || []} crews={crews || []} />
    </>;
});
TaskCalendarView.displayName = 'TaskCalendarView';
export default TaskCalendarView;