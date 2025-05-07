
import React, { memo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DragDropProvider } from '../DragDropContext';
import { Task, Crew } from '../ScheduleTypes';
import { isSameDay } from '@/components/calendar/CalendarUtils';
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
  
  const handleDragStart = useCallback((data: any, event: React.DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify(data));
    }
  }, []);
  
  const handleDragEnd = useCallback(() => {
    // Reset drag state
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-7 md:grid-cols-1">
      <div className="lg:col-span-5">
        <DragDropProvider>
          <CalendarCard 
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            onAddNewTask={onAddNewTask}
            onMoveTask={onMoveTask}
          />
        </DragDropProvider>
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
