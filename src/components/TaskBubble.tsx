
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskBubbleProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask?: (id: string) => void;
}

const TaskBubble = ({ tasks, onToggleTask, onDeleteTask }: TaskBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const taskCount = tasks.length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90 flex items-center justify-center relative"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle className="h-6 w-6" />
            {taskCount > 0 && (
              <Badge className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center p-0 text-xs bg-secondary">
                {taskCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end" side="top">
          <div className="bg-primary/10 p-3 flex justify-between items-center">
            <h3 className="font-medium text-sm">
              Tasks ({completedCount}/{taskCount})
            </h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="max-h-60 overflow-auto p-3">
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-2 rounded-md bg-background border"
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                        className="rounded-sm"
                      />
                      <span className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                        {task.text}
                      </span>
                    </div>
                    {onDeleteTask && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 rounded-full"
                        onClick={() => onDeleteTask(task.id)}
                      >
                        &times;
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tasks available
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TaskBubble;
