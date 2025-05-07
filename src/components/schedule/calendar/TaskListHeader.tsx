
import React, { memo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TaskStatusBadges from './TaskStatusBadges';

interface TaskListHeaderProps {
  selectedDate: Date;
  onAddNewTask: () => void;
  pendingTasks: number;
  completedTasks: number;
  overdueTasks?: number;
  conflictingTasks?: number;
}

const TaskListHeader = memo(({
  selectedDate,
  onAddNewTask,
  pendingTasks,
  completedTasks,
  overdueTasks = 0,
  conflictingTasks = 0
}: TaskListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</h2>
        <TaskStatusBadges
          pendingTasks={pendingTasks}
          completedTasks={completedTasks}
          overdueTasks={overdueTasks}
          conflictingTasks={conflictingTasks}
          className="mt-1.5"
        />
      </div>
      <Button
        onClick={onAddNewTask}
        size="sm"
        variant="outline"
        className="flex items-center gap-1 h-8"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span>Add Task</span>
      </Button>
    </div>
  );
});

TaskListHeader.displayName = 'TaskListHeader';

export default TaskListHeader;
