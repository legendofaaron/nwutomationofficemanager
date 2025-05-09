
import React, { memo } from 'react';
import { Check, Clock, MapPin, Edit, User, Users, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, Crew } from '../ScheduleTypes';
import { useDraggable } from '@/components/schedule/useDraggable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskItemProps {
  task: Task;
  crews: Crew[];
  onToggleTaskCompletion: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDragStart: (data: any, event: React.DragEvent) => void;
  onDragEnd: () => void;
}

const TaskItem = memo(({
  task,
  crews,
  onToggleTaskCompletion,
  onEditTask,
  onDragStart,
  onDragEnd
}: TaskItemProps) => {
  // Set up draggable task
  const { isDragging, dragProps } = useDraggable({ 
    id: task.id, 
    type: 'task',
    data: task,
    onDragStart: (event) => onDragStart(task, event),
    onDragEnd
  });
  
  // Get crew code letter for display if crew exists
  const getCrewCode = (crewId?: string) => {
    if (!crewId) return '';
    const index = crews.findIndex(c => c.id === crewId);
    return index > -1 ? String.fromCharCode(65 + index) : '';
  };
  
  // Format time range for display
  const timeRange = task.startTime && task.endTime
    ? `${task.startTime} - ${task.endTime}`
    : task.startTime || 'All day';
  
  return (
    <div 
      className={cn(
        "flex items-start gap-2 p-3 bg-card border rounded-md shadow-sm",
        "hover:border-primary/30 transition-colors duration-150",
        task.completed ? "opacity-70" : "",
        isDragging ? "opacity-50 border-primary/50" : ""
      )}
      data-draggable-type="task"
      data-task-id={task.id}
      {...dragProps}
    >
      <div className="pt-0.5">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={() => onToggleTaskCompletion(task.id)}
          className="mt-0.5"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className={cn(
            "font-medium text-sm line-clamp-2",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h4>
          
          {onEditTask && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 w-7 p-0 -mt-1 -mr-1"
              onClick={() => onEditTask(task.id)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-y-1 gap-x-3 mt-1.5 text-xs text-muted-foreground">
          {timeRange && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeRange}</span>
            </div>
          )}
          
          {task.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate max-w-[150px]">{task.location}</span>
            </div>
          )}
          
          {task.clientId && !task.location && (
            <div className="flex items-center gap-1">
              <Building className="h-3.5 w-3.5" />
              <span className="truncate max-w-[150px]">Client Visit</span>
            </div>
          )}
        </div>
        
        {/* Assignment information */}
        <div className="flex gap-2 mt-2">
          {task.assignedTo && (
            <Badge variant="outline" className="px-2 py-0 h-6 text-xs">
              <User className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[100px]">{task.assignedTo}</span>
            </Badge>
          )}
          
          {task.crewId && (
            <Badge variant="outline" className="px-2 py-0 h-6 text-xs">
              <Users className="h-3 w-3 mr-1" />
              <span>
                Crew {getCrewCode(task.crewId)}
                {task.crewName && `: ${task.crewName}`}
              </span>
            </Badge>
          )}
          
          {task.completed && (
            <Badge className="px-2 py-0 h-6 text-xs bg-green-500 hover:bg-green-500/90">
              <Check className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
