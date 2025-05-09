
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskStatusBadgesProps {
  pendingTasks: number;
  completedTasks: number;
  overdueTasks?: number;
  conflictingTasks?: number; 
  className?: string;
}

const TaskStatusBadges: React.FC<TaskStatusBadgesProps> = ({
  pendingTasks,
  completedTasks,
  overdueTasks = 0,
  conflictingTasks = 0,
  className
}) => {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {pendingTasks > 0 && (
        <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-5 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900/50">
          <span>{pendingTasks}</span>
          <span className="ml-1">pending</span>
        </Badge>
      )}
      
      {completedTasks > 0 && (
        <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-5 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900/50">
          <span>{completedTasks}</span>
          <span className="ml-1">completed</span>
        </Badge>
      )}
      
      {overdueTasks > 0 && (
        <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-5 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900/50">
          <span>{overdueTasks}</span>
          <span className="ml-1">overdue</span>
        </Badge>
      )}
      
      {conflictingTasks > 0 && (
        <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-5 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900/50">
          <span>{conflictingTasks}</span>
          <span className="ml-1">conflict{conflictingTasks > 1 ? 's' : ''}</span>
        </Badge>
      )}
    </div>
  );
};

export default TaskStatusBadges;
