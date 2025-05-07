
import React from 'react';
import { Task } from '../ScheduleTypes';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import DroppableArea from '../DroppableArea';

interface TaskCalendarViewProps {
  tasks: Task[];
  onEditTask: (taskId: string) => void;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ tasks, onEditTask }) => {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  
  // Generate the week days from Monday to Sunday
  const weekDays = [...Array(7)].map((_, i) => addDays(startOfCurrentWeek, i));
  
  // Get tasks for a specific day
  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      // If the task has a date, check if it's the same day
      if (task.date) {
        return isSameDay(new Date(task.date), date);
      }
      return false;
    });
  };
  
  return (
    <div className="space-y-4">
      <Card className="shadow-md border-t-4 border-t-blue-500 dark:border-t-blue-600">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold">Weekly Calendar</h3>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100">
              Week of {format(startOfCurrentWeek, 'MMM dd, yyyy')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {weekDays.map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "text-center py-2 font-medium text-sm border-b",
                  isToday(day) && "text-blue-600 dark:text-blue-400"
                )}
              >
                <div className="mb-1">{format(day, 'EEE')}</div>
                <div 
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center mx-auto",
                    isToday(day) && "bg-blue-100 dark:bg-blue-900/50"
                  )}
                >
                  {format(day, 'd')}
                </div>
              </div>
            ))}
            
            {/* Calendar grid */}
            {weekDays.map((day, i) => {
              const dayTasks = getTasksForDay(day);
              
              return (
                <DroppableArea
                  key={format(day, 'yyyy-MM-dd')}
                  id={`day-${format(day, 'yyyy-MM-dd')}`}
                  acceptTypes={['task']}
                  onDrop={(item) => console.log(`Task dropped on ${format(day, 'yyyy-MM-dd')}`, item)}
                  className={cn(
                    "h-[300px] overflow-y-auto p-2 border rounded-md",
                    isToday(day) && "bg-blue-50/40 dark:bg-blue-900/10",
                    !isToday(day) && "bg-card"
                  )}
                  activeClassName="drop-area-active"
                  onClick={() => {}}
                >
                  <div className="space-y-2">
                    {dayTasks.length === 0 ? (
                      <div className="text-center text-xs text-muted-foreground h-full flex items-center justify-center">
                        <span>No tasks</span>
                      </div>
                    ) : (
                      dayTasks.map(task => (
                        <div 
                          key={task.id}
                          onClick={() => onEditTask(task.id)}
                          className={cn(
                            "p-2 rounded text-xs cursor-pointer border",
                            task.completed ? "bg-muted/30 text-muted-foreground" : "bg-card hover:bg-accent/50"
                          )}
                        >
                          <div className="font-medium truncate">
                            {task.title}
                          </div>
                          {task.startTime && task.endTime && (
                            <div className="text-muted-foreground mt-1">
                              {task.startTime} - {task.endTime}
                            </div>
                          )}
                          {task.assignedTo && (
                            <div className="text-muted-foreground mt-1 truncate">
                              {task.assignedTo}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </DroppableArea>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendarView;
