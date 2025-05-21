
import React, { useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { DragItem, Task } from '../ScheduleTypes';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import DroppableArea from '../DroppableArea';
import { toast } from '@/hooks/use-toast';
import { CalendarDayProps } from '@/components/ui/calendar';
import { useDragDrop } from '../DragDropContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CalendarCardProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  onMoveTask?: (taskId: string, newDate: Date) => void;
  onItemDrop?: (item: DragItem, date: Date) => void;
  onAddNewTask?: () => void;
  isDirectDrop?: boolean;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onMoveTask,
  onItemDrop,
  onAddNewTask,
  isDirectDrop = true
}) => {
  // Current month state for navigation
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);
  
  // Map tasks to their dates for visualization
  const tasksMap = new Map<string, Task[]>();

  // Add the drag state from context
  const { isDragging, draggedItem } = useDragDrop();

  // State to track which day is currently being dragged over
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);
  
  // Create a tasks map for easy lookup
  tasks.forEach(task => {
    const dateKey = task.date.toDateString();
    if (!tasksMap.has(dateKey)) {
      tasksMap.set(dateKey, []);
    }
    tasksMap.get(dateKey)!.push(task);
  });

  // Navigate to previous month
  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newDate);
  }, [currentMonth]);

  // Navigate to next month
  const handleNextMonth = useCallback(() => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newDate);
  }, [currentMonth]);

  // Custom day rendering to show task indicators and handle drag highlighting
  const renderDayWithTasks = useCallback((props: CalendarDayProps) => {
    const { date, children } = props;
    const dateKey = date.toDateString();
    const dayTasks = tasksMap.get(dateKey) || [];
    const isBeingDraggedOver = dateKey === dragOverDay;
    const isSelected = selectedDate.toDateString() === date.toDateString();
    
    return (
      <DroppableArea 
        id={`calendar-day-${format(date, 'yyyy-MM-dd')}`}
        acceptTypes={['task', 'employee', 'crew', 'client', 'booking', 'todo']}
        onDragEnter={e => {
          setDragOverDay(dateKey);
        }}
        onDragLeave={e => {
          if (dateKey === dragOverDay) {
            setDragOverDay(null);
          }
        }}
        onDrop={(item, e) => {
          setDragOverDay(null);
          if (onItemDrop) {
            onItemDrop(item, date);
          } else if (item.type === 'task' && onMoveTask && item.id) {
            onMoveTask(item.id, date);
          }
          onSelectDate(date);
        }}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-full transition-colors duration-150",
          isSelected && "bg-primary/20 font-medium",
          isBeingDraggedOver && isDragging && "bg-primary/30 outline-dashed outline-2 outline-primary"
        )}
        activeClassName="outline-dashed outline-2 outline-primary/70"
      >
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent/60",
            isSelected && "bg-primary text-primary-foreground"
          )}>
            {children}
          </div>
          
          {dayTasks.length > 0 && (
            <div className="absolute bottom-1 flex justify-center space-x-0.5 mt-0.5">
              {dayTasks.length <= 3 ? (
                dayTasks.map((_, idx) => (
                  <div key={idx} className="w-1 h-1 bg-primary rounded-full" />
                ))
              ) : (
                <>
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  <div className="w-1 h-1 bg-primary rounded-full" />
                </>
              )}
            </div>
          )}
        </div>
      </DroppableArea>
    );
  }, [onMoveTask, onItemDrop, tasksMap, dragOverDay, isDragging, selectedDate, onSelectDate]);

  // Reset drag highlight when dragging stops
  useEffect(() => {
    if (!isDragging) {
      setDragOverDay(null);
    }
  }, [isDragging]);

  return (
    <Card className="bg-background border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-card border-b border-border/30 flex flex-row justify-between items-center py-3 px-4 h-14">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Calendar</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 rounded-full">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Month</span>
          </Button>
          
          <span className="text-sm font-medium min-w-24 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Month</span>
          </Button>
        </div>
        
        {onAddNewTask && (
          <Button onClick={onAddNewTask} variant="outline" size="sm" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-none border-none shadow-none p-3"
          components={{
            Day: renderDayWithTasks
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
