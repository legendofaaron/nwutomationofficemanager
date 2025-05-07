
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Task, Crew } from '../ScheduleTypes';
import { getCrewDisplayCode } from '../ScheduleHelpers';
import { format } from 'date-fns';
import { CalendarCheck, CheckCircle, Clock, MapPin, MoveHorizontal, Pencil, Plus, User, Users } from 'lucide-react';
import DraggableItem from '../DraggableItem';
import { useDragDrop } from '../DragDropContext';

interface TasksCardProps {
  tasks: Task[];
  selectedDate: Date;
  onToggleTaskCompletion: (taskId: string) => void;
  crews: Crew[];
  onAddNewTask: () => void;
  onEditTask?: (taskId: string) => void;
}

const TasksCard: React.FC<TasksCardProps> = ({
  tasks,
  selectedDate,
  onToggleTaskCompletion,
  crews,
  onAddNewTask,
  onEditTask
}) => {
  const { isDragging } = useDragDrop();
  
  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => 
    task.date && selectedDate && task.date.toDateString() === selectedDate.toDateString()
  );

  // Count tasks by status
  const completedTasks = tasksForSelectedDate.filter(task => task.completed).length;
  const pendingTasks = tasksForSelectedDate.length - completedTasks;

  return (
    <Card className="shadow-md border rounded-xl overflow-hidden">
      <CardHeader className="bg-card border-b p-5 space-y-0">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <div className="flex items-center justify-center p-1.5 rounded-md bg-primary/10 dark:bg-primary/20">
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
          </CardTitle>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" onClick={onAddNewTask} className="gap-1.5 px-3 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-3.5 w-3.5" />
                  Add Task
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new task for this day</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex gap-3">
          {pendingTasks > 0 && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40">
              <Clock className="h-3 w-3 mr-1" />
              {pendingTasks} Pending
            </Badge>}
          {completedTasks > 0 && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/40">
              <CheckCircle className="h-3 w-3 mr-1" />
              {completedTasks} Completed
            </Badge>}
        </div>
      </CardHeader>
      <CardContent className={cn("p-5", isDragging && "bg-muted/20 border-dashed border-2 border-primary/20 rounded-b-xl")}>
        <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
          {tasksForSelectedDate.length === 0 ? (
            <div className="empty-day-container rounded-xl py-10 animate-fade-in" onClick={onAddNewTask}>
              <div className="p-3 bg-muted/30 rounded-full mb-3 mx-auto w-fit">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center">
                No tasks scheduled for this day<br />
                <span className="text-sm">Click to add a new task</span>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasksForSelectedDate.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  crews={crews}
                  onToggleTaskCompletion={onToggleTaskCompletion}
                  onEditTask={onEditTask}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface TaskItemProps {
  task: Task;
  crews: Crew[];
  onToggleTaskCompletion: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, crews, onToggleTaskCompletion, onEditTask }) => {
  return (
    <DraggableItem
      id={task.id}
      type="task"
      data={{ 
        ...task, 
        title: task.title 
      }}
      disabled={task.completed}
      className={cn(
        "task-item flex items-start justify-between p-4 rounded-lg border transition-all duration-200",
        task.completed 
          ? "completed bg-green-50/80 dark:bg-green-900/10 border-green-100 dark:border-green-900/30" 
          : "bg-card hover:shadow-sm border-blue-100/60 dark:border-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/40"
      )}
    >
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <Checkbox 
              id={`cal-task-${task.id}`} 
              checked={task.completed} 
              onCheckedChange={() => onToggleTaskCompletion(task.id)} 
              className={cn(
                "h-5 w-5 transition-colors",
                task.completed 
                  ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" 
                  : "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              )} 
            />
          </div>
          <div className="space-y-1 min-w-0">
            <span className={cn(
              "font-medium block truncate max-w-full transition-all",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </span>
            
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                <span>{task.startTime} - {task.endTime}</span>
              </div>
              
              {/* Show assignment info */}
              {task.assignedTo && (
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                  <span className="truncate">{task.assignedTo}</span>
                </div>
              )}
              
              {task.crew && task.crew.length > 0 && (
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                  <span className="truncate">
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
                  <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                  <span className="truncate">{task.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 ml-3">
        <Badge 
          variant={task.completed ? "outline" : "secondary"} 
          className={cn(
            "text-xs whitespace-nowrap",
            task.completed 
              ? "bg-green-50 text-green-700 border-green-200 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300" 
              : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          )}
        >
          {task.completed ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
          {task.completed ? 'Completed' : 'Pending'}
        </Badge>
        
        <div className="flex items-center gap-1">
          {!task.completed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <MoveHorizontal className="h-3.5 w-3.5 text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <p>Drag to reschedule</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {onEditTask && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" 
              onClick={() => onEditTask(task.id)}
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </Button>
          )}
        </div>
      </div>
    </DraggableItem>
  );
};

export default TasksCard;
