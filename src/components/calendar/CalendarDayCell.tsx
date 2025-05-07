
import React, { memo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Todo } from './CalendarTypes';

interface CalendarDayCellProps {
  date: Date;
  selectedDate: Date | null;
  taskCount: number;
  isDragging: boolean;
  onDateClick: (date: Date) => void;
  onDateDoubleClick: (date: Date) => void;
  onDrop: (date: Date, e: React.DragEvent) => void;
  draggedTodo: Todo | null;
}

// Memo to prevent unnecessary re-renders
const CalendarDayCell: React.FC<CalendarDayCellProps> = memo(({
  date,
  selectedDate,
  taskCount,
  isDragging,
  onDateClick,
  onDateDoubleClick,
  onDrop,
  draggedTodo
}) => {
  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
  const dateValue = date.getDate();
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add visual feedback
    e.currentTarget.classList.add("bg-accent/30", "border-primary");
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Remove visual feedback
    e.currentTarget.classList.remove("bg-accent/30", "border-primary");
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-accent/30", "border-primary");
    onDrop(date, e);
  }, [date, onDrop]);

  const handleClick = useCallback(() => onDateClick(date), [date, onDateClick]);
  const handleDoubleClick = useCallback(() => onDateDoubleClick(date), [date, onDateDoubleClick]);
  
  return (
    <div 
      className={cn(
        "relative w-full h-full flex items-center justify-center",
        isDragging && "cursor-copy drop-shadow-sm border-2 border-dashed border-primary/50",
        "hover:bg-accent/10 transition-colors cursor-pointer"
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn(
        "flex flex-col items-center justify-center",
        isSelected && "font-bold"
      )}>
        <span className="text-xs overflow-hidden text-center w-full">
          {dateValue}
        </span>
        {taskCount > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -bottom-1 px-1 py-0 min-w-4 h-3 text-[0.6rem] flex items-center justify-center"
          >
            {taskCount}
          </Badge>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memoization
  return (
    prevProps.date.toDateString() === nextProps.date.toDateString() &&
    prevProps.taskCount === nextProps.taskCount &&
    prevProps.isDragging === nextProps.isDragging &&
    (prevProps.selectedDate?.toDateString() === nextProps.selectedDate?.toDateString()) &&
    prevProps.draggedTodo?.id === nextProps.draggedTodo?.id
  );
});

CalendarDayCell.displayName = 'CalendarDayCell';

export default CalendarDayCell;
