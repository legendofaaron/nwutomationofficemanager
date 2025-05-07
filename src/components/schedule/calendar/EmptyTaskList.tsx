
import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyTaskListProps {
  onAddNewTask: () => void;
}

const EmptyTaskList: React.FC<EmptyTaskListProps> = ({ onAddNewTask }) => {
  return (
    <div className="empty-day-container rounded-xl py-10 animate-fade-in" onClick={onAddNewTask}>
      <div className="p-3 bg-muted/30 rounded-full mb-3 mx-auto w-fit">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-center">
        No tasks scheduled for this day<br />
        <span className="text-sm">Click to add a new task</span>
      </p>
    </div>
  );
};

export default EmptyTaskList;
