
import React, { memo, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { isSameDay } from '@/components/calendar/CalendarUtils';
import { useDragDrop } from '../hooks/useDragDrop';
import { Task, Crew } from '../ScheduleTypes';
import { addMonths, subMonths } from 'date-fns';

// Import our optimized components
import CalendarCard from './CalendarCard';
import TaskDetailsCard from './TaskDetailsCard';

interface TaskCalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | null) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  crews: Crew[];
  onAddNewTask: (type?: string) => void;
  onMoveTask?: (taskId: string, date: Date) => void;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = memo(({
  tasks,
  selectedDate,
  onSelectDate,
  onToggleTaskCompletion,
  onEditTask,
  crews,
  onAddNewTask,
  onMoveTask
}) => {
  // State for calendar navigation
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());

  // Effect to update currentMonth when selectedDate changes significantly (different month)
  useEffect(() => {
    if (selectedDate && (selectedDate.getMonth() !== currentMonth.getMonth() || selectedDate.getFullYear() !== currentMonth.getFullYear())) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate, currentMonth]);

  // Calculate task counts for the selected date
  const tasksForSelectedDate = tasks.filter(task => 
    isSameDay(task.date, selectedDate)
  ).sort((a, b) => {
    // Sort by time if available, then by completion status
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    if (a.startTime) return -1;
    if (b.startTime) return 1;
    return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
  });

  const completedTasks = tasksForSelectedDate.filter(t => t.completed).length;
  const pendingTasks = tasksForSelectedDate.length - completedTasks;
  
  // Use our refactored drag and drop hook
  const { handleDragStart, handleDragEnd } = useDragDrop({
    onTaskMove: onMoveTask,
    acceptTypes: ['task'],
    tasks // Pass tasks to the hook
  });
  
  // Handle dropping a task on a day
  const handleDayDrop = useCallback((data: any, event: React.DragEvent, date: Date) => {
    if (data.type === 'task' && onMoveTask) {
      onMoveTask(data.id, date);
    }
  }, [onMoveTask]);

  // Handle month navigation
  const handlePreviousMonth = useCallback(() => {
    const prevMonth = subMonths(currentMonth, 1);
    setCurrentMonth(prevMonth);
    onMonthChange(prevMonth);
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
    onMonthChange(nextMonth);
  }, [currentMonth]);

  // Add a function to be called when calendar's month changes internally
  const onMonthChange = useCallback((newMonth: Date) => {
    setCurrentMonth(newMonth);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-7 md:grid-cols-1">
      <div className="lg:col-span-5">
        <CalendarCard 
          tasks={tasks}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          currentMonth={currentMonth}
          onMonthChange={onMonthChange}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
          handleDayDrop={handleDayDrop}
          onAddNewTask={onAddNewTask}
        />
      </div>
      
      <div className="lg:col-span-2">
        <TaskDetailsCard 
          selectedDate={selectedDate}
          tasksForSelectedDate={tasksForSelectedDate}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          onToggleTaskCompletion={onToggleTaskCompletion}
          onAddNewTask={() => onAddNewTask('individual')}
          onEditTask={onEditTask}
          crews={crews}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>
    </div>
  );
});

TaskCalendarView.displayName = 'TaskCalendarView';

export default TaskCalendarView;
