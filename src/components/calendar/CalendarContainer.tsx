
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import CalendarDayCell from './CalendarDayCell';
import { Todo } from './CalendarTypes';

interface CalendarContainerProps {
  selectedDate: Date;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  handleDateChange: (date: Date | undefined) => void;
  getTaskCountForDay: (date: Date) => number;
  isDragging: boolean;
  onDateDoubleClick: (date: Date) => void;
  handleDayDrop: (date: Date, e: React.DragEvent) => void;
  draggedTodo: Todo | null;
  calendarRef: React.RefObject<HTMLDivElement>;
  handleCalendarDragOver: (e: React.DragEvent) => void;
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({
  selectedDate,
  currentMonth,
  setCurrentMonth,
  handleDateChange,
  getTaskCountForDay,
  isDragging,
  onDateDoubleClick,
  handleDayDrop,
  draggedTodo,
  calendarRef,
  handleCalendarDragOver
}) => {
  return (
    <div 
      ref={calendarRef}
      onDragOver={handleCalendarDragOver}
      className="flex-shrink-0 w-full"
    >
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateChange}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        className={cn("rounded-md border bg-card shadow-sm w-full", "pointer-events-auto")}
        components={{
          Day: (props) => (
            <CalendarDayCell 
              date={props.date} 
              selectedDate={selectedDate} 
              taskCount={getTaskCountForDay(props.date)} 
              isDragging={isDragging}
              onDateClick={(date) => handleDateChange(date)}
              onDateDoubleClick={onDateDoubleClick}
              onDrop={handleDayDrop}
              draggedTodo={draggedTodo}
            />
          )
        }}
      />
    </div>
  );
};

export default CalendarContainer;
