
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Task, Crew, Client, ClientLocation } from './ScheduleTypes';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, User, Users, MapPin, Calendar, List, Pencil } from 'lucide-react';
import { format } from 'date-fns';

interface TaskListViewProps {
  tasks: Task[];
  onToggleTaskCompletion: (taskId: string) => void;
  crews: Crew[];
  clients: Client[];
  clientLocations: ClientLocation[];
  onEditTask?: (taskId: string) => void;
}

// Wrap TaskItem in memo to prevent unnecessary re-renders
const TaskItem = memo(({ 
  task, 
  onToggleTaskCompletion, 
  crews, 
  onEditTask 
}: { 
  task: Task; 
  onToggleTaskCompletion: (taskId: string) => void;
  crews: Crew[];
  onEditTask?: (taskId: string) => void;
}) => {
  return (
    <div
      key={task.id}
      className={cn(
        "task-item flex items-start justify-between p-4 rounded-lg border transition-all duration-200",
        task.completed ? "bg-muted/30" : "bg-card hover:shadow-md hover:border-blue-500/30"
      )}
    >
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-3">
          <Checkbox 
            id={`list-task-${task.id}`}
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
          
          {onEditTask && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 ml-auto"
              onClick={() => onEditTask(task.id)}
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </Button>
          )}
        </div>
        
        <div className="pl-8 space-y-2 text-sm text-muted-foreground">
          {/* Show time if available */}
          {task.startTime && task.endTime && (
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-2" />
              <span>{task.startTime} - {task.endTime}</span>
            </div>
          )}
          
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
              <span>Crew {task.crewId ? task.crewId : ''}</span>
              
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
  );
});

TaskItem.displayName = 'TaskItem';

// Memoize the entire DateGroup component
const DateGroup = memo(({ 
  dateStr, 
  tasks, 
  onToggleTaskCompletion, 
  crews, 
  onEditTask 
}: { 
  dateStr: string; 
  tasks: Task[];
  onToggleTaskCompletion: (taskId: string) => void;
  crews: Crew[];
  onEditTask?: (taskId: string) => void; 
}) => {
  return (
    <div key={dateStr} className="space-y-3">
      <div className="flex items-center gap-2 text-base font-medium px-1">
        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span>{format(new Date(dateStr), 'MMMM d, yyyy')}</span>
        <Badge 
          className="ml-2 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-100"
        >
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </Badge>
      </div>
      
      <div className="space-y-2 pl-6 border-l-2 border-blue-100 dark:border-blue-900/30">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggleTaskCompletion={onToggleTaskCompletion}
            crews={crews}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </div>
  );
});

DateGroup.displayName = 'DateGroup';

// Memoize the main TaskListView component
const TaskListView: React.FC<TaskListViewProps> = memo(({ 
  tasks, 
  onToggleTaskCompletion, 
  crews,
  clients,
  clientLocations,
  onEditTask
}) => {
  // Sort tasks by date and then by start time
  const sortedTasks = [...tasks].sort((a, b) => {
    // First compare by date
    const dateComparison = a.date.getTime() - b.date.getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // If dates are the same, compare by start time
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    
    // If one doesn't have start time, prioritize the one with a time
    if (a.startTime) return -1;
    if (b.startTime) return 1;
    
    // If neither has a start time, order alphabetically
    return a.title.localeCompare(b.title);
  });

  // Group tasks by date
  const tasksByDate = sortedTasks.reduce<Record<string, Task[]>>((acc, task) => {
    const dateStr = task.date.toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(task);
    return acc;
  }, {});

  // Get dates in chronological order
  const orderedDates = Object.keys(tasksByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-md border-t-4 border-t-blue-500 dark:border-t-blue-600">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
              <List className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Task List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orderedDates.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No tasks scheduled.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {orderedDates.map(dateStr => (
                <DateGroup 
                  key={dateStr} 
                  dateStr={dateStr} 
                  tasks={tasksByDate[dateStr]}
                  onToggleTaskCompletion={onToggleTaskCompletion}
                  crews={crews}
                  onEditTask={onEditTask}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

TaskListView.displayName = 'TaskListView';

export default TaskListView;
