
import React, { useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { DragItem, Task } from '../ScheduleTypes';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import DroppableArea from '../DroppableArea';
import { toast } from '@/hooks/use-toast';
import { CalendarDayProps } from '@/components/ui/calendar';
import { useDragDrop } from '../DragDropContext';
import { cn } from '@/lib/utils';

interface CalendarCardProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  onMoveTask?: (taskId: string, newDate: Date) => void;
  onItemDrop?: (item: DragItem, date: Date) => void;
  isDirectDrop?: boolean;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onMoveTask,
  onItemDrop,
  isDirectDrop = true
}) => {
  // Map tasks to their dates for visualization
  const tasksMap = new Map<string, Task[]>();
  
  // Add the drag state from context
  const { isDragging, draggedItem } = useDragDrop();
  
  // State to track which day is currently being dragged over
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);
  
  tasks.forEach(task => {
    const dateKey = task.date.toDateString();
    if (!tasksMap.has(dateKey)) {
      tasksMap.set(dateKey, []);
    }
    tasksMap.get(dateKey)!.push(task);
  });
  
  // Custom day rendering to show task indicators and handle drag highlighting
  const renderDayWithTasks = useCallback((props: CalendarDayProps) => {
    const { date, children } = props;
    const dateKey = date.toDateString();
    const dayTasks = tasksMap.get(dateKey) || [];
    const isBeingDraggedOver = dateKey === dragOverDay;
    
    return (
      <DroppableArea
        id={`calendar-day-${format(date, 'yyyy-MM-dd')}`}
        acceptTypes={['task', 'employee', 'crew', 'client', 'booking', 'todo']}
        onDragEnter={(e) => {
          setDragOverDay(dateKey);
        }}
        onDragLeave={(e) => {
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
        }}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-full transition-colors duration-150",
          isBeingDraggedOver && isDragging && "bg-[#4A4A4A]/40 outline-dashed outline-2 outline-[#BBBBBB]"
        )}
        activeClassName="outline-dashed outline-2 outline-[#BBBBBB]/50"
      >
        <div className="flex flex-col items-center text-[#DDDDDD]">
          {children}
          {dayTasks.length > 0 && (
            <div className="absolute bottom-1 flex justify-center space-x-0.5 mt-0.5">
              {dayTasks.length <= 3 ? (
                dayTasks.map((_, idx) => (
                  <div 
                    key={idx} 
                    className="w-1 h-1 bg-[#BBBBBB] rounded-full"
                  />
                ))
              ) : (
                <>
                  <div className="w-1 h-1 bg-[#BBBBBB] rounded-full" />
                  <div className="w-1 h-1 bg-[#BBBBBB] rounded-full" />
                  <div className="w-1 h-1 bg-[#BBBBBB] rounded-full" />
                </>
              )}
            </div>
          )}
        </div>
      </DroppableArea>
    );
  }, [onMoveTask, onItemDrop, tasksMap, dragOverDay, isDragging]);

  // Reset drag highlight when dragging stops
  useEffect(() => {
    if (!isDragging) {
      setDragOverDay(null);
    }
  }, [isDragging]);

  return (
    <Card className="bg-[#222222] border-[#444444]">
      <CardHeader className="flex flex-row items-center justify-between py-4 bg-[#333333] border-b border-[#444444]">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-[#BBBBBB]" />
          <div className="text-lg font-medium text-[#DDDDDD]">Calendar</div>
        </div>
        <div className="text-sm text-[#BBBBBB]">
          {format(selectedDate, 'MMMM yyyy')}
        </div>
      </CardHeader>
      <CardContent className="p-1">
        <div className="p-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            className="rounded-md border border-[#444444] pointer-events-auto"
            components={{
              Day: renderDayWithTasks
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
