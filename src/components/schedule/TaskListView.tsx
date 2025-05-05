
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Task, Client, ClientLocation, Crew } from './ScheduleTypes';
import { cn } from '@/lib/utils';
import { User, Users, MapPin, Calendar, Clock, Check, X, DollarSign } from 'lucide-react';
import { getCrewDisplayCode, getClientLocationInfo } from './ScheduleHelpers';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

interface TaskListViewProps {
  tasks: Task[];
  onToggleTaskCompletion: (taskId: string) => void;
  crews: Crew[];
  clients: Client[];
  clientLocations: ClientLocation[];
}

const TaskListView: React.FC<TaskListViewProps> = ({ 
  tasks, 
  onToggleTaskCompletion,
  crews,
  clients,
  clientLocations
}) => {
  return (
    <Card className="shadow-md border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Check className="h-5 w-5 text-primary" />
          </div>
          All Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length === 0 && (
            <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground">
              No tasks scheduled yet
            </div>
          )}
          
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
                task.completed ? "bg-muted/30" : "bg-card hover:shadow-md hover:border-primary/30"
              )}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => onToggleTaskCompletion(task.id)}
                    className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <span className={cn(
                    "font-medium transition-all", 
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </span>
                  
                  {task.completed ? (
                    <Badge variant="outline" className="ml-auto bg-muted/50 text-xs gap-1 font-normal">
                      <Check className="h-3 w-3" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-auto bg-primary/10 text-primary text-xs gap-1 font-normal">
                      <Clock className="h-3 w-3" /> Scheduled
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-8 text-sm text-muted-foreground pl-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary/70" />
                    <span>{format(task.date, 'EEEE, MMM d, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary/70" />
                    <span>{task.startTime} - {task.endTime}</span>
                  </div>
                  
                  {/* Show assignment info */}
                  {task.assignedTo && (
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-primary/70" />
                      <span>Assigned to: <span className="font-medium text-foreground opacity-80">{task.assignedTo}</span></span>
                    </div>
                  )}
                  
                  {task.crew && task.crew.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-primary/70" />
                      <div>
                        <span>Crew {task.crewId ? getCrewDisplayCode(task.crewId, crews) : ''}: </span>
                        <span className="font-medium text-foreground opacity-80">{task.crew.join(', ')}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Show location info */}
                  {task.location && (
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="h-3.5 w-3.5 text-primary/70" />
                      <span className="font-medium text-foreground opacity-80">{task.location}</span>
                      
                      {/* If it's a client location, show detailed info */}
                      {task.clientId && task.clientLocationId && (
                        <span className="text-xs text-muted-foreground">
                          {(() => {
                            const locationInfo = getClientLocationInfo(
                              task.clientId, 
                              task.clientLocationId,
                              clients,
                              clientLocations
                            );
                            if (!locationInfo) return null;
                            return `(${locationInfo.address}, ${locationInfo.city || ''} ${locationInfo.state || ''})`;
                          })()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskListView;
