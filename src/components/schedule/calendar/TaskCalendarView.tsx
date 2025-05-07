
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { addDays, subDays, format, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
} from 'lucide-react';
import DroppableArea from '../DroppableArea';
import { Task, DroppableConfig } from '../ScheduleTypes';
import { cn } from '@/lib/utils';
import TasksCard from './TasksCard';

interface TaskCalendarViewProps {
  tasks: Task[];
  crews?: any[];
  onEditTask: (taskId: string) => void;
  onToggleTaskCompletion: (taskId: string) => void;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ 
  tasks,
  crews = [],
  onEditTask,
  onToggleTaskCompletion
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewingWeek, setViewingWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Calendar navigation
  const prevWeek = () => setViewingWeek(subWeeks(viewingWeek, 1));
  const nextWeek = () => setViewingWeek(addWeeks(viewingWeek, 1));
  const goToToday = () => {
    setViewingWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setSelectedDate(new Date());
  };

  // Generate the 7 days of the week starting from the viewingWeek
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(viewingWeek, i));

  // Handle drop configuration for days
  const getDropConfig = (date: Date): DroppableConfig => {
    return {
      id: `day-${format(date, 'yyyy-MM-dd')}`,
      acceptTypes: ['task'],
      onDrop: (item) => {
        console.log(`Dropped task ${item.id} on ${format(date, 'yyyy-MM-dd')}`);
      }
    };
  };

  // Handle creating a new task
  const handleAddNewTask = () => {
    // Implementation is handled in the parent component
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-md">
        <CardContent className="p-4">
          {/* Calendar header with navigation */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prevWeek}
                className="rounded-r-none border-r-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={goToToday}
                className="rounded-none px-3 border-x-0"
              >
                <CalendarIcon className="h-4 w-4 mr-1" /> Today
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextWeek}
                className="rounded-l-none border-l-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="font-medium">
              {format(viewingWeek, 'MMMM yyyy')}
            </div>
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-sm font-medium py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar dates */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {weekDays.map(date => {
              const dropConfig = getDropConfig(date);
              return (
                <DroppableArea 
                  key={date.toISOString()} 
                  id={dropConfig.id}
                  acceptTypes={dropConfig.acceptTypes}
                  onDrop={dropConfig.onDrop}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-md border text-sm hover:bg-muted/50 cursor-pointer transition-all",
                    isSameDay(date, new Date()) && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30",
                    isSameDay(date, selectedDate) && "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-800/50"
                  )}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className={cn(
                    "font-medium",
                    isSameDay(date, new Date()) && "text-blue-600 dark:text-blue-400",
                    isSameDay(date, selectedDate) && "text-blue-700 dark:text-blue-300"
                  )}>{format(date, 'd')}</span>
                  
                  {/* Task indicators */}
                  <div className="flex mt-1 gap-0.5">
                    {tasks.filter(task => isSameDay(task.date, date)).length > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                    )}
                  </div>
                </DroppableArea>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Tasks for selected date */}
      <Card className="md:col-span-1">
        <TasksCard 
          tasks={tasks}
          selectedDate={selectedDate}
          onToggleTaskCompletion={onToggleTaskCompletion}
          crews={crews}
          onAddNewTask={handleAddNewTask}
          onEditTask={onEditTask}
        />
      </Card>
    </div>
  );
};

export default TaskCalendarView;
