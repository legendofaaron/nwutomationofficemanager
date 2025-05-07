
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';

interface EmptyTaskListProps {
  onAddNewTask: () => void;
}

const EmptyTaskList: React.FC<EmptyTaskListProps> = ({ onAddNewTask }) => {
  return (
    <div className="text-center py-8 space-y-3 border-2 border-dashed border-muted rounded-lg">
      <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 h-12 w-12 rounded-full flex items-center justify-center">
        <CalendarPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium">No tasks scheduled</h3>
        <p className="text-sm text-muted-foreground">Schedule tasks for this day to see them here</p>
      </div>
      <Button
        variant="outline"
        onClick={onAddNewTask}
        className="mt-3"
      >
        Add a task
      </Button>
    </div>
  );
};

export default EmptyTaskList;
