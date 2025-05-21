
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
    const dateValue = date.getDate();
    
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
          isSelected && "bg-[#444444] rounded-full",
          isBeingDraggedOver && isDragging && "bg-[#333333] outline-dashed outline-1 outline-[#555555] rounded-full"
        )}
        activeClassName="outline-dashed outline-1 outline-[#555555] rounded-full"
      >
        <div className="flex flex-col items-center">
          <div className={cn(
            "h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#333333]",
            isSelected && "bg-[#444444] text-white"
          )}>
            <span className="text-lg font-medium">{dateValue}</span>
          </div>
          
          {dayTasks.length > 0 && (
            <div className="absolute -bottom-1 flex justify-center space-x-0.5 mt-0.5">
              {dayTasks.length <= 3 ? (
                dayTasks.map((_, idx) => (
                  <div key={idx} className="w-1 h-1 bg-[#3366FF] rounded-full" />
                ))
              ) : (
                <>
                  <div className="w-1 h-1 bg-[#3366FF] rounded-full" />
                  <div className="w-1 h-1 bg-[#3366FF] rounded-full" />
                  <div className="w-1 h-1 bg-[#3366FF] rounded-full" />
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
    <Card className="bg-[#1A1A1A] border-[#333333] shadow-sm overflow-hidden">
      <CardHeader className="bg-[#222222] border-b border-[#333333] flex flex-row justify-between items-center py-3 px-4 h-14">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[#3366FF]" />
          <h3 className="font-medium text-[#EEEEEE]">Calendar</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 rounded-full text-[#DDDDDD]">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Month</span>
          </Button>
          
          <span className="text-sm font-medium min-w-24 text-center text-[#EEEEEE]">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 rounded-full text-[#DDDDDD]">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Month</span>
          </Button>
        </div>
        
        {onAddNewTask && (
          <Button onClick={onAddNewTask} variant="outline" size="sm" className="flex items-center gap-1.5 bg-[#2A2A2A] border-[#444444] text-[#DDDDDD]">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-0 bg-[#1A1A1A]">
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
