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
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';

interface CalendarCardProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  onMoveTask?: (taskId: string, newDate: Date) => void;
  onItemDrop?: (item: DragItem, date: Date) => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onMoveTask,
  onItemDrop,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const { isDragging } = useDragDrop();
  const [activeDropTarget, setActiveDropTarget] = useState<string | null>(null);
  const [lastDropTime, setLastDropTime] = useState<number>(0);
  const { calendarDate } = useAppContext();

  // Effect to update currentMonth when selectedDate changes significantly (different month)
  useEffect(() => {
    if (selectedDate && (selectedDate.getMonth() !== currentMonth.getMonth() || selectedDate.getFullYear() !== currentMonth.getFullYear())) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate, currentMonth]);

  // Effect to ensure we're in sync with the global calendar date
  useEffect(() => {
    if (calendarDate && calendarDate.toDateString() !== selectedDate?.toDateString()) {
      onSelectDate(calendarDate);
    }
  }, [calendarDate, onSelectDate, selectedDate]);

  // Listen for drag end to reset active drop target
  useEffect(() => {
    if (!isDragging) {
      setActiveDropTarget(null);
    }
    
    // Add global drag event listeners for improved reliability
    const handleDragEnd = () => {
      setActiveDropTarget(null);
    };
    
    document.addEventListener('dragend', handleDragEnd);
    
    return () => {
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, [isDragging]);

  // Handle day selection with a single click
  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      // Immediately update the selected date with a single click
      onSelectDate(date);
    }
  };

  // Handle dropping a task on a day with debounce to prevent duplicate drops
  const handleDayDrop = (item: DragItem, date: Date) => {
    // Prevent duplicate drops (this fixes the multiple drag issue)
    const now = Date.now();
    if (now - lastDropTime < 500) {
      return; // Ignore drops that happen too quickly after another
    }
    setLastDropTime(now);
    
    // Reset active drop target
    setActiveDropTarget(null);
    
    // Add visual feedback
    const dayElement = document.querySelector(`[data-date="${date.toISOString().split('T')[0]}"]`);
    if (dayElement) {
      dayElement.classList.add('drop-highlight');
      setTimeout(() => {
        dayElement.classList.remove('drop-highlight');
      }, 500);
    }
    
    if (item.type === 'task' && onMoveTask) {
      onMoveTask(item.id, date);
      
      // Show a toast notification for successful drop
      const taskTitle = item.data.title || 'Task';
      toast.success(`Task "${taskTitle}" moved to ${format(date, 'MMMM d')}`, {
        duration: 3000,
      });
    } else if (onItemDrop && (item.type === 'employee' || item.type === 'crew' || item.type === 'client')) {
      // Pass non-task item drops to the parent handler
      onItemDrop(item, date);
      // Update selected date to where the item was dropped
      onSelectDate(date);
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
          Click on a day to see tasks for that date
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <style>
        {`
          .calendar-day-cell {
            transition: all 0.2s ease-out;
            cursor: pointer !important;
          }
          .calendar-day-cell.drop-highlight {
            background-color: rgba(var(--primary), 0.3);
            transform: scale(1.05);
            transition: all 0.2s ease-out;
          }
          .drop-target-active {
            background-color: rgba(var(--primary), 0.15);
            border: 2px dashed hsl(var(--primary));
          }
          .calendar-grid .rdp-day {
            height: 40px;
            margin: 0;
            width: 100%;
            cursor: pointer !important;
          }
        `}
        </style>
        <Calendar 
          mode="single" 
          selected={selectedDate} 
          onSelect={handleDaySelect} 
          month={currentMonth} 
          onMonthChange={setCurrentMonth} 
          className={cn("rounded-xl border shadow-sm", "calendar-grid", isDragging && "drag-active-calendar")} 
          propagateChanges={true} {/* Enable global date synchronization */}
          components={{
            DayContent: (props: DayProps) => {
              const dayDate = props.date;
              const dayTasks = tasks.filter(task => task.date.toDateString() === dayDate.toDateString());
              const hasTasks = dayTasks.length > 0;
              const hasCompletedTasks = dayTasks.some(task => task.completed);
              const hasPendingTasks = dayTasks.some(task => !task.completed);
              const droppableId = `day-${dayDate.toISOString()}`;
              const isToday = dayDate.toDateString() === new Date().toDateString();
              const isSelected = selectedDate?.toDateString() === dayDate.toDateString();
              const isActiveTarget = activeDropTarget === droppableId;
              
              // Format date for data attribute (for targeting with feedback animations)
              const dateAttr = dayDate.toISOString().split('T')[0];

              return (
                <DroppableArea
                  id={droppableId}
                  acceptTypes={['task', 'employee', 'crew', 'client']}
                  onDrop={(item, event) => handleDayDrop(item, dayDate)}
                  className={cn(
                    "calendar-day-cell relative h-full w-full flex items-center justify-center rounded-md transition-colors", 
                    isSelected && "selected-day bg-primary/10",
                    isDragging && "drag-target",
                    isActiveTarget && "drop-target-active",
                    hasTasks && "font-medium"
                  )}
                  activeClassName="bg-primary/20 dark:bg-primary/30 border-dashed border-2 border-primary scale-105"
                  onDragEnter={() => setActiveDropTarget(droppableId)}
                  onDragLeave={() => setActiveDropTarget(null)}
                  onClick={() => handleDaySelect(dayDate)}
                  data-date={dateAttr}
                >
                  {/* Day number */}
                  <div className={cn(
                    "z-10 font-medium",
                    isToday && 
                    "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center"
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
