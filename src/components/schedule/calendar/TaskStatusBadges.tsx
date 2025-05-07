
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertTriangle, CalendarX } from 'lucide-react';
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
    <div className={cn("flex flex-wrap gap-2", className)}>
      {pendingTasks > 0 && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40">
          <Clock className="h-3 w-3 mr-1" />
          {pendingTasks} {pendingTasks === 1 ? 'Pending' : 'Pending'}
        </Badge>
      )}
      
      {completedTasks > 0 && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/40">
          <CheckCircle className="h-3 w-3 mr-1" />
          {completedTasks} {completedTasks === 1 ? 'Completed' : 'Completed'}
        </Badge>
      )}
      
      {overdueTasks > 0 && (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/40">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {overdueTasks} {overdueTasks === 1 ? 'Overdue' : 'Overdue'}
        </Badge>
      )}
      
      {conflictingTasks > 0 && (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/40">
          <CalendarX className="h-3 w-3 mr-1" />
          {conflictingTasks} {conflictingTasks === 1 ? 'Conflict' : 'Conflicts'}
        </Badge>
      )}
      
      {pendingTasks === 0 && completedTasks === 0 && overdueTasks === 0 && conflictingTasks === 0 && (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700/40">
          No tasks scheduled
        </Badge>
      )}
    </div>
  );
};

export default TaskStatusBadges;
