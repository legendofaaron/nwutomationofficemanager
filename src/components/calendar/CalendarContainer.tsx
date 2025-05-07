
import React, { memo } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo } from './CalendarTypes';
import CalendarDayCell from './CalendarDayCell';
import { formatMonthAndYear } from './CalendarUtils';

interface CalendarContainerProps {
  selectedDate: Date;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  handleDateChange: (date: Date, draggedTodo: Todo | null) => void;
  getTaskCountForDay: (date: Date) => number;
  isDragging: boolean;
  onDateDoubleClick: (date: Date) => void;
  handleDayDrop: (date: Date, e: React.DragEvent) => void;
  draggedTodo: Todo | null;
  calendarRef: React.RefObject<HTMLDivElement>;
  handleCalendarDragOver: (e: React.DragEvent) => void;
}

// Memo to prevent unnecessary re-renders
const CalendarContainer: React.FC<CalendarContainerProps> = memo(({
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
  handleCalendarDragOver,
}) => {
  // Create navigation handlers that don't recreate on each render
  const goToPreviousMonth = () => {
    const newDate = subMonths(currentMonth, 1);
    setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
  };
  
  const goToNextMonth = () => {
    const newDate = addMonths(currentMonth, 1);
    setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
  };
  
  // Calendar grid setup - memoized generation
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Generate days grid with appropriate offset for the first day of the month
  const daysGrid = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null); // Empty cells for days before the 1st of the month
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    daysGrid.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  }
  
  // Determine days of week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div 
      className="calendar-container border rounded-md bg-card overflow-hidden shadow-sm relative"
    >
      {/* Calendar Header */}
      <div className="calendar-header flex justify-between items-center p-2 bg-muted/30 border-b">
        <Button 
          variant="ghost" 
          size="sm"
          className="h-7 w-7 p-0"
          onClick={goToPreviousMonth}
          type="button"
          aria-label="Previous Month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-sm font-medium">
          {formatMonthAndYear(currentMonth)}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="h-7 w-7 p-0"
          onClick={goToNextMonth}
          type="button"
          aria-label="Next Month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Calendar Grid */}
      <div 
        ref={calendarRef}
        className="calendar-grid"
        onDragOver={handleCalendarDragOver}
      >
        {/* Days of week header */}
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-day-header text-center text-xs font-medium text-muted-foreground p-1">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {daysGrid.map((day, index) => {
          if (!day) {
            // Empty cell
            return <div key={`empty-${index}`} className="calendar-day-empty"></div>
          }
          
          return (
            <CalendarDayCell
              key={day.toString()}
              date={day}
              selectedDate={selectedDate}
              taskCount={getTaskCountForDay(day)}
              isDragging={isDragging}
              onDateClick={(date) => handleDateChange(date, draggedTodo)}
              onDateDoubleClick={onDateDoubleClick}
              onDrop={handleDayDrop}
              draggedTodo={draggedTodo}
            />
          );
        })}
      </div>
    </div>
  );
});

CalendarContainer.displayName = 'CalendarContainer';

export default CalendarContainer;
