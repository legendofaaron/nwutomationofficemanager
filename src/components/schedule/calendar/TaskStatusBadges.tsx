
import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';

interface TaskStatusBadgesProps {
  pendingTasks: number;
  completedTasks: number;
}

const TaskStatusBadges = memo(({ pendingTasks, completedTasks }: TaskStatusBadgesProps) => {
  return (
    <div className="flex gap-3">
      {pendingTasks > 0 && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40">
          <Clock className="h-3 w-3 mr-1" />
          {pendingTasks} Pending
        </Badge>
      )}
      {completedTasks > 0 && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/40">
          <CheckCircle className="h-3 w-3 mr-1" />
          {completedTasks} Completed
        </Badge>
      )}
    </div>
  );
});

TaskStatusBadges.displayName = 'TaskStatusBadges';

export default TaskStatusBadges;
