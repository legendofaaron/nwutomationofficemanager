
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Task, Crew } from './ScheduleTypes';
import { cn } from '@/lib/utils';
import { User, Users, MapPin, CheckCircle, X, Clock } from 'lucide-react';
import { getCrewDisplayCode } from './ScheduleHelpers';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

interface TaskCalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  crews: Crew[];
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ 
  tasks, 
  selectedDate, 
  onSelectDate,
  onToggleTaskCompletion,
  crews
}) => {
  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(
    task => task.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="shadow-md border-t-4 border-t-blue-500 hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Schedule Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            className={cn("rounded-md border", "pointer-events-auto")}
            components={{
              DayContent: ({ day }) => {
                // Check if there are tasks on this day
                const hasTasks = tasks.some(
                  task => task.date.toDateString() === day.toDate().toDateString()
                );
                
                return (
                  <div className="relative h-full flex items-center justify-center">
                    <div className="calendar-day-number z-10">
                      {format(day.toDate(), 'd')}
                    </div>
                    {hasTasks && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-blue-500 rounded-full" />
                    )}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="shadow-md border-t-4 border-t-blue-500 hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            {format(selectedDate, 'MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasksForSelectedDate.length === 0 && (
              <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                No tasks scheduled for this day
              </div>
            )}
            
            {tasksForSelectedDate.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-start justify-between p-4 rounded-lg border transition-all duration-200",
                  task.completed ? "bg-muted/30" : "bg-card hover:shadow-md hover:border-blue-500/30"
                )}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={`cal-task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => onToggleTaskCompletion(task.id)}
                      className="h-5 w-5 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                    />
                    <span className={cn(
                      "font-medium transition-all", 
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                  </div>
                  
                  <div className="pl-8 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-2" />
                      <span>{task.startTime} - {task.endTime}</span>
                    </div>
                    
                    {/* Show assignment info */}
                    {task.assignedTo && (
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-2" />
                        <span>{task.assignedTo}</span>
                      </div>
                    )}
                    
                    {task.crew && task.crew.length > 0 && (
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-2" />
                        <span>
                          Crew {task.crewId ? getCrewDisplayCode(task.crewId, crews) : ''}
                        </span>
                        
                        <div className="flex -space-x-1 ml-2">
                          {task.crew.slice(0, 3).map((member, i) => (
                            <Avatar key={i} className="h-5 w-5 border border-background">
                              <AvatarFallback className="text-[0.6rem] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                {member.substring(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {task.crew.length > 3 && (
                            <Badge variant="secondary" className="h-5 w-5 rounded-full flex items-center justify-center text-[0.6rem] p-0">
                              +{task.crew.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Show location info */}
                    {task.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-2" />
                        <span>{task.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Badge 
                  variant={task.completed ? "outline" : "secondary"}
                  className={cn(
                    "ml-2 text-xs",
                    task.completed ? "bg-muted/50" : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100"
                  )}
                >
                  {task.completed ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {task.completed ? 'Done' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendarView;
