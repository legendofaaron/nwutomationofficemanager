
import React, { memo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Task } from '../ScheduleTypes';
import { Badge } from '@/components/ui/badge';
import { isSameDay } from '@/components/calendar/CalendarUtils';
import { useDroppable } from '@/components/schedule/useDraggable';

interface TaskIndicatorProps {
  date: Date;
  tasks: Task[];
  selectedDate: Date;
  onDayDrop: (data: any, event: React.DragEvent, date: Date) => void;
}

const TaskIndicator: React.FC<TaskIndicatorProps> = memo(({
  date,
  tasks,
  selectedDate,
  onDayDrop
}) => {
  const isSelected = isSameDay(date, selectedDate);
  const dateValue = date.getDate();
  
  // Filter tasks for this specific date
  const tasksForDay = tasks.filter(task => isSameDay(task.date, date));
  const pendingTasks = tasksForDay.filter(task => !task.completed).length;
  const completedTasks = tasksForDay.filter(task => task.completed).length;
  
  // Setup droppable area
  const { isOver, dropProps } = useDroppable({
    accept: ['task', 'employee', 'crew'],
    onDrop: (data, event) => onDayDrop(data, event, date)
  });
  
  return (
    <div 
      className={cn(
        "relative w-full h-full flex flex-col items-center justify-center",
        isSelected && "bg-primary/5 font-medium",
        isOver && "bg-primary/10",
        "transition-all duration-200"
      )}
      {...dropProps}
    >
      <div className="p-0.5 text-center">
        {dateValue}
      </div>
      
      {tasksForDay.length > 0 && (
        <div className="flex gap-0.5 absolute bottom-0 left-0 right-0 justify-center">
          {pendingTasks > 0 && (
            <Badge
              variant="secondary"
              className="h-1.5 w-1.5 p-0 rounded-full bg-blue-500"
              aria-label={`${pendingTasks} pending tasks`}
            />
          )}
          {completedTasks > 0 && (
            <Badge
              variant="secondary"
              className="h-1.5 w-1.5 p-0 rounded-full bg-green-500"
              aria-label={`${completedTasks} completed tasks`}
            />
          )}
        </div>
      )}
    </div>
  );
});

TaskIndicator.displayName = 'TaskIndicator';

export default TaskIndicator;
