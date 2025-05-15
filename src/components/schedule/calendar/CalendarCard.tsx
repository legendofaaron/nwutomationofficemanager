
import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { DragItem, Task } from '../ScheduleTypes';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import DroppableArea from '../DroppableArea';
import { toast } from '@/hooks/use-toast';

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
  isDirectDrop = true // Enable direct drop by default
}) => {
  // Map tasks to their dates for visualization
  const tasksMap = new Map<string, Task[]>();
  
  tasks.forEach(task => {
    const dateKey = task.date.toDateString();
    if (!tasksMap.has(dateKey)) {
      tasksMap.set(dateKey, []);
    }
    tasksMap.get(dateKey)!.push(task);
  });
  
  // Custom day rendering to show task indicators
  const renderDayWithTasks = useCallback((day: React.ReactNode, props: any) => {
    const date = props.date as Date;
    const dateKey = date.toDateString();
    const dayTasks = tasksMap.get(dateKey) || [];
    
    return (
      <DroppableArea
        id={`calendar-day-${format(date, 'yyyy-MM-dd')}`}
        acceptTypes={['task', 'employee', 'crew', 'client']}
        onDrop={(item) => {
          if (onItemDrop) {
            onItemDrop(item, date);
          } else if (item.type === 'task' && onMoveTask && item.id) {
            onMoveTask(item.id, date);
          }
        }}
        className="relative flex flex-col items-center justify-center w-full h-full"
        activeClassName="bg-primary/10 outline-dashed outline-2 outline-primary/50"
      >
        <div className="flex flex-col items-center">
          {props.children}
          {dayTasks.length > 0 && (
            <div className="absolute bottom-1 flex justify-center space-x-0.5 mt-0.5">
              {dayTasks.length <= 3 ? (
                dayTasks.map((_, idx) => (
                  <div 
                    key={idx} 
                    className="w-1 h-1 bg-primary rounded-full"
                  />
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
  }, [onMoveTask, onItemDrop, tasksMap]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <div className="text-lg font-medium">Calendar</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {format(selectedDate, 'MMMM yyyy')}
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            className="rounded-md border"
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
