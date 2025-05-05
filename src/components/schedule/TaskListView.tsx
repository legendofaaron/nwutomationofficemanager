
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Task } from './ScheduleTypes';
import { cn } from '@/lib/utils';
import { User, Users, MapPin } from 'lucide-react';
import { getCrewDisplayCode, getClientLocationInfo } from './ScheduleHelpers';

interface TaskListViewProps {
  tasks: Task[];
  onToggleTaskCompletion: (taskId: string) => void;
  crews: any[];
  clients: any[];
  clientLocations: any[];
}

const TaskListView: React.FC<TaskListViewProps> = ({ 
  tasks, 
  onToggleTaskCompletion,
  crews,
  clients,
  clientLocations
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border",
                task.completed ? "bg-muted/50" : "bg-card"
              )}
            >
              <div className="space-y-1">
                <span className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                  {task.title}
                </span>
                <div className="text-sm text-muted-foreground">
                  <p>Date: {task.date.toLocaleDateString()}</p>
                  <p>{task.startTime} - {task.endTime}</p>
                  
                  {/* Show assignment info */}
                  {task.assignedTo && (
                    <div className="flex items-center mt-1">
                      <User className="h-3 w-3 mr-1" />
                      <span>Assigned to: {task.assignedTo}</span>
                    </div>
                  )}
                  
                  {task.crew && task.crew.length > 0 && (
                    <div className="flex items-center mt-1">
                      <Users className="h-3 w-3 mr-1" />
                      <span>
                        Crew {task.crewId ? getCrewDisplayCode(task.crewId, crews) : ''}: {task.crew.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {/* Show location info */}
                  {task.location && (
                    <div className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{task.location}</span>
                      
                      {/* If it's a client location, show detailed info */}
                      {task.clientId && task.clientLocationId && (
                        <span className="ml-1 text-xs text-muted-foreground">
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
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTaskCompletion(task.id)}
                className="h-4 w-4"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskListView;
