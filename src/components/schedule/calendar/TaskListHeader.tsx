
import React, { memo } from 'react';
import { format } from 'date-fns';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarCheck, Plus } from 'lucide-react';
import TaskStatusBadges from './TaskStatusBadges';

interface TaskListHeaderProps {
  selectedDate: Date;
  onAddNewTask: () => void;
  pendingTasks: number;
  completedTasks: number;
}

const TaskListHeader = memo(({
  selectedDate,
  onAddNewTask,
  pendingTasks,
  completedTasks
}: TaskListHeaderProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-1">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <div className="flex items-center justify-center p-1.5 rounded-md bg-primary/10 dark:bg-primary/20">
            <CalendarCheck className="h-5 w-5 text-primary" />
          </div>
          {format(selectedDate, 'MMMM d, yyyy')}
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
      
      <TaskStatusBadges 
        pendingTasks={pendingTasks}
        completedTasks={completedTasks}
      />
    </div>
  );
});

TaskListHeader.displayName = 'TaskListHeader';

export default TaskListHeader;
