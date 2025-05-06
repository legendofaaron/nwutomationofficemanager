
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Task, DragItem } from '../ScheduleTypes';
import { cn } from '@/lib/utils';
import { format, addMonths, subMonths } from 'date-fns';
import { DayProps } from 'react-day-picker';
import DroppableArea from '../DroppableArea';
import { useDragDrop } from '../DragDropContext';

interface CalendarCardProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  onMoveTask?: (taskId: string, newDate: Date) => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onMoveTask,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const { isDragging } = useDragDrop();

  // Effect to update currentMonth when selectedDate changes significantly (different month)
  useEffect(() => {
    if (selectedDate && (selectedDate.getMonth() !== currentMonth.getMonth() || selectedDate.getFullYear() !== currentMonth.getFullYear())) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate, currentMonth]);

  // Handle dropping a task on a day
  const handleDayDrop = (item: DragItem, date: Date) => {
    if (item.type === 'task' && onMoveTask) {
      onMoveTask(item.id, date);
    }
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  return (
    <Card className="shadow-md border rounded-xl overflow-hidden">
      <CardHeader className="bg-card border-b p-5 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <div className="flex items-center justify-center p-1.5 rounded-md bg-primary/10 dark:bg-primary/20">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            Schedule Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePreviousMonth}
              className="h-7 w-7 p-0"
            >
              ←
            </Button>
            <span className="text-sm font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextMonth}
              className="h-7 w-7 p-0"
            >
              →
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Drag tasks to reschedule or select a date to view details
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Calendar 
          mode="single" 
          selected={selectedDate} 
          onSelect={onSelectDate} 
          month={currentMonth} 
          onMonthChange={setCurrentMonth} 
          className={cn("rounded-xl border shadow-sm", "calendar-grid")} 
          components={{
            DayContent: (props: DayProps) => {
              const dayDate = props.date;
              const dayTasks = tasks.filter(task => task.date.toDateString() === dayDate.toDateString());
              const hasTasks = dayTasks.length > 0;
              const hasCompletedTasks = dayTasks.some(task => task.completed);
              const hasPendingTasks = dayTasks.some(task => !task.completed);
              const droppableId = `day-${dayDate.toISOString()}`;

              return (
                <DroppableArea
                  id={droppableId}
                  acceptTypes={['task', 'employee', 'crew', 'client']}
                  onDrop={(item, event) => handleDayDrop(item, dayDate)}
                  className={cn(
                    "calendar-day-cell relative h-full flex items-center justify-center rounded-md transition-colors", 
                    dayDate.toDateString() === selectedDate?.toDateString() && "selected-day",
                    hasTasks && "font-medium"
                  )}
                  activeClassName="bg-blue-100 dark:bg-blue-800/30 border-dashed border-blue-400"
                >
                  {/* Day number */}
                  <div className={cn(
                    "z-10 font-medium",
                    dayDate.toDateString() === new Date().toDateString() && 
                    "bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center"
                  )}>
                    {format(dayDate, 'd')}
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
            }
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
