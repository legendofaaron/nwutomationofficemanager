
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTodo: (text: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTodo }) => {
  const [newTodoText, setNewTodoText] = useState('');
  
  const handleAddTodo = () => {
    if (newTodoText.trim() === '') return;
    
    onAddTodo(newTodoText);
    setNewTodoText('');
  };
  
  return (
    <div className="flex space-x-1.5 mb-1.5">
      <Input
        placeholder="Add new task..."
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        className="h-7 text-xs"
      />
      <Button onClick={handleAddTodo} size="sm" className="h-7 px-1.5">
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default TaskInput;
