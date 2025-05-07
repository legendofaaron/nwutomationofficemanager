
import React from 'react';
import { ListTodo, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TaskListHeaderProps {
  selectedDate: Date;
  onAddTaskClick: () => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  selectedDate,
  onAddTaskClick
}) => {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <div className="flex items-center">
        <ListTodo className="h-4 w-4 mr-1.5" />
        <h3 className="text-sm font-medium">
          Tasks for {format(selectedDate, 'MMM d, yyyy')}
        </h3>
      </div>
      <Button 
        size="sm" 
        className="h-7 px-2"
        onClick={onAddTaskClick}
      >
        <Plus className="h-3.5 w-3.5" />
        <span className="sr-only">Add Task</span>
      </Button>
    </div>
  );
};

export default TaskListHeader;
