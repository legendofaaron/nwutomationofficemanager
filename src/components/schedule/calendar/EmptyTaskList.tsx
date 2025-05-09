
import React from 'react';
import { Calendar, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTaskListProps {
  onAddNewTask: () => void;
}

const EmptyTaskList: React.FC<EmptyTaskListProps> = ({ onAddNewTask }) => {
  return (
    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg p-6 text-center">
      <div className="bg-muted/50 p-2 rounded-full mb-3">
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium">No tasks scheduled</h3>
      <p className="text-muted-foreground text-xs mt-1">
        Add a new task to start scheduling your day
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4 flex items-center gap-1"
        onClick={onAddNewTask}
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span>Add Task</span>
      </Button>
    </div>
  );
};

export default EmptyTaskList;
