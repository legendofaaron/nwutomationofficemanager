
import React, { memo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DayProps } from 'react-day-picker';
import { Task } from '../ScheduleTypes';
import CalendarNavigationHeader from './CalendarNavigationHeader';
import TaskIndicator from './TaskIndicator';

interface CalendarCardProps {
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  tasks: Task[];
  handleDayDrop: (data: any, event: React.DragEvent, date: Date) => void;
  onAddNewTask: (type?: string) => void;
}

const CalendarCard = memo(({
  selectedDate,
  onSelectDate,
  currentMonth,
  onMonthChange,
  handlePreviousMonth,
  handleNextMonth,
  tasks,
  handleDayDrop,
  onAddNewTask
}: CalendarCardProps) => {
  return (
    <Card className="shadow-md border rounded-xl overflow-hidden">
      <CardHeader className="bg-card border-b p-5 space-y-1">
        <CalendarNavigationHeader 
          currentMonth={currentMonth}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
        />
      </CardHeader>
      <CardContent className="p-4">
        <Calendar 
          mode="single" 
          selected={selectedDate} 
          onSelect={onSelectDate} 
          month={currentMonth} 
          onMonthChange={onMonthChange} 
          className={cn("rounded-xl border shadow-sm", "calendar-grid")} 
          components={{
            DayContent: (props: DayProps) => (
              <TaskIndicator 
                date={props.date} 
                tasks={tasks}
                selectedDate={selectedDate}
                onDayDrop={handleDayDrop}
              />
            )
          }} 
        />
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Optimize re-renders with custom comparison
  return (
    prevProps.selectedDate.toDateString() === nextProps.selectedDate.toDateString() &&
    prevProps.currentMonth.toDateString() === nextProps.currentMonth.toDateString() &&
    prevProps.tasks.length === nextProps.tasks.length
  );
});

CalendarCard.displayName = 'CalendarCard';

export default CalendarCard;
