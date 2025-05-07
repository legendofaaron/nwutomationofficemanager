
import React from 'react';
import { format } from 'date-fns';
import { Todo } from './CalendarTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Clock, User, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';

interface CalendarDayViewProps {
  todos: Todo[];
  selectedDate: Date;
  toggleTodoCompletion: (id: string) => void;
  deleteTodo: (id: string) => void;
  getCrewDisplayCode: (crewId: string) => string;
}

const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  todos,
  selectedDate,
  toggleTodoCompletion,
  deleteTodo,
  getCrewDisplayCode
}) => {
  if (todos.length === 0) {
    return (
      <div className="text-xs text-muted-foreground text-center py-1.5 bg-background rounded-sm">
        No tasks for today
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {todos.map((todo) => (
        <div 
          key={todo.id} 
          className={cn(
            "flex items-center justify-between space-x-1.5 text-xs bg-background rounded-sm p-1",
            "hover:bg-accent/20 transition-colors"
          )}
          draggable
          style={{ cursor: 'grab' }}
        >
          <div className="flex items-center space-x-1.5">
            <Checkbox 
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => toggleTodoCompletion(todo.id)}
              className="h-3.5 w-3.5"
            />
            <div className="flex flex-col">
              <label
                htmlFor={`todo-${todo.id}`}
                className={cn(
                  "text-xs cursor-pointer",
                  todo.completed && "line-through text-muted-foreground"
                )}
              >
                {todo.text}
              </label>
              
              {/* Show assigned person and other details if available */}
              {(todo.assignedTo || todo.crewName || todo.location || todo.startTime) && (
                <div className="flex flex-wrap gap-x-2 mt-0.5 text-[10px] text-muted-foreground">
                  {todo.assignedTo && (
                    <div className="flex items-center">
                      {todo.assignedToAvatar ? (
                        <Avatar className="h-3 w-3 mr-0.5">
                          <AvatarImage src={todo.assignedToAvatar} />
                          <AvatarFallback className="text-[8px]">
                            {todo.assignedTo.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <User className="h-2.5 w-2.5 mr-0.5" />
                      )}
                      {todo.assignedTo}
                    </div>
                  )}
                  
                  {todo.crewName && (
                    <div className="flex items-center">
                      <Users className="h-2.5 w-2.5 mr-0.5" />
                      {todo.crewId ? (
                        <span>Crew {getCrewDisplayCode(todo.crewId)}: {todo.crewName}</span>
                      ) : (
                        <span>{todo.crewName}</span>
                      )}
                    </div>
                  )}
                  
                  {todo.startTime && (
                    <div className="flex items-center">
                      <Clock className="h-2.5 w-2.5 mr-0.5" />
                      {todo.startTime}{todo.endTime ? ` - ${todo.endTime}` : ''}
                    </div>
                  )}
                  
                  {todo.location && (
                    <div className="flex items-center">
                      <MapPin className="h-2.5 w-2.5 mr-0.5" />
                      {todo.location}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={() => deleteTodo(todo.id)}
          >
            &times;
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CalendarDayView;
