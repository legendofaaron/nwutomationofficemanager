
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DroppableArea } from '../DroppableArea';

interface TaskIndicatorProps {
  date: Date;
  tasks: any[];
  selectedDate?: Date | null;
  onDayDrop: (data: any, event: React.DragEvent, date: Date) => void;
}

const TaskIndicator = memo(({ 
  date, 
  tasks, 
  selectedDate,
  onDayDrop
}: TaskIndicatorProps) => {
  const dayTasks = tasks.filter(task => task.date.toDateString() === date.toDateString());
  const hasTasks = dayTasks.length > 0;
  const hasCompletedTasks = dayTasks.some(task => task.completed);
  const hasPendingTasks = dayTasks.some(task => !task.completed);
  const isToday = date.toDateString() === new Date().toDateString();
  const isSelected = selectedDate?.toDateString() === date.toDateString();

  return (
    <DroppableArea
      id={`day-${date.toISOString()}`}
      acceptTypes={['task']}
      onDrop={(data, event) => onDayDrop(data, event, date)}
      className={cn(
        "calendar-day-cell relative h-full flex items-center justify-center", 
        isSelected && "selected-day",
        hasTasks && "font-medium"
      )}
      activeClassName="bg-blue-100 dark:bg-blue-800/30 border-dashed border-blue-400"
    >
      {/* Day number */}
      <div className={cn(
        "z-10 font-medium",
        isToday && 
        "bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center"
      )}>
        {format(date, 'd')}
      </div>
      
      {/* Task indicators */}
      {hasTasks && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-0.5">
          {hasPendingTasks && <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />}
          {hasCompletedTasks && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
          
          {/* If there are many tasks, show a count */}
          {dayTasks.length > 2 && (
            <span className="text-[0.6rem] text-muted-foreground absolute -bottom-1 left-1/2 transform -translate-x-1/2 font-normal">
              {dayTasks.length}
            </span>
          )}
        </div>
      )}
    </DroppableArea>
  );
}, (prevProps, nextProps) => {
  // Optimize re-renders
  if (prevProps.date.toDateString() !== nextProps.date.toDateString()) return false;
  
  // Compare if tasks for this day have changed
  const prevTasks = prevProps.tasks.filter(task => task.date.toDateString() === prevProps.date.toDateString());
  const nextTasks = nextProps.tasks.filter(task => task.date.toDateString() === nextProps.date.toDateString());
  
  if (prevTasks.length !== nextTasks.length) return false;
  
  // Check if selected state changed
  if ((prevProps.selectedDate?.toDateString() ?? '') !== (nextProps.selectedDate?.toDateString() ?? '')) return false;
  
  return true;
});

TaskIndicator.displayName = 'TaskIndicator';

export default TaskIndicator;
