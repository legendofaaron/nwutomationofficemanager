
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Todo } from './CalendarTypes';
import { format } from 'date-fns';
import { toast } from 'sonner';

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

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
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
  
  return (
    <div 
      className={cn(
        "relative w-full h-full flex items-center justify-center",
        isDragging && "cursor-copy drop-shadow-sm border-2 border-dashed border-primary/50",
        "hover:bg-accent/10 transition-colors cursor-pointer"
      )}
      onClick={() => onDateClick(date)}
      onDoubleClick={() => onDateDoubleClick(date)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // Add visual feedback
        e.currentTarget.classList.add("bg-accent/30", "border-primary");
      }}
      onDragLeave={(e) => {
        // Remove visual feedback
        e.currentTarget.classList.remove("bg-accent/30", "border-primary");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("bg-accent/30", "border-primary");
        onDrop(date, e);
      }}
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
};

export default CalendarDayCell;
