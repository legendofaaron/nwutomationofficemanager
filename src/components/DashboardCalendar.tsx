
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { type DayProps } from 'react-day-picker';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

const DashboardCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTodoText, setNewTodoText] = useState('');
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Team meeting', completed: false, date: new Date() },
    { id: '2', text: 'Review project proposal', completed: true, date: new Date() },
    { id: '3', text: 'Call with client', completed: false, date: new Date() },
  ]);

  const todaysTodos = todos.filter(
    todo => todo.date.toDateString() === selectedDate.toDateString()
  );

  // Count tasks for each day
  const getTaskCountForDay = (date: Date): number => {
    return todos.filter(todo => todo.date.toDateString() === date.toDateString()).length;
  };

  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      date: selectedDate
    };
    
    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  const toggleTodoCompletion = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Drag and drop functionality
  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo);
  };

  const handleDragEnd = () => {
    setDraggedTodo(null);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      
      // If there's a todo being dragged, update its date
      if (draggedTodo) {
        const updatedTodos = todos.map(todo => 
          todo.id === draggedTodo.id 
            ? { ...todo, date } 
            : todo
        );
        setTodos(updatedTodos);
        setDraggedTodo(null);
      }
    }
  };

  // Custom day render to show task indicators
  const customDayRender = (day: DayProps) => {
    const date = day.date;
    // Check if the current day is selected by comparing dates
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const taskCount = getTaskCountForDay(date);
    const dateValue = date.getDate();
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className={cn(
          "flex flex-col items-center justify-center",
          isSelected && "font-bold"
        )}>
          {dateValue}
          {taskCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -bottom-1 px-1 py-0 min-w-5 h-4 text-[0.65rem] flex items-center justify-center"
            >
              {taskCount}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          className={cn("rounded-md border bg-card shadow-sm", "pointer-events-auto")}
          components={{
            Day: customDayRender
          }}
        />
      </div>
      
      <div className="flex-grow overflow-auto mt-2">
        <div className="mb-1.5 flex items-center">
          <ListTodo className="h-4 w-4 mr-1.5" />
          <h3 className="text-sm font-medium">
            Tasks for {format(selectedDate, 'MMM d, yyyy')}
          </h3>
        </div>
        
        <div className="flex space-x-1.5 mb-1.5">
          <Input
            placeholder="Add new task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="h-7 text-xs"
          />
          <Button onClick={addTodo} size="sm" className="h-7 px-1.5">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <div className="space-y-0.5 max-h-[100px] bg-card rounded-md p-1.5 overflow-y-auto">
          {todaysTodos.length > 0 ? (
            todaysTodos.map((todo) => (
              <div 
                key={todo.id} 
                className="flex items-center justify-between space-x-1.5 text-xs bg-background rounded-sm p-1"
                draggable
                onDragStart={() => handleDragStart(todo)}
                onDragEnd={handleDragEnd}
                style={{ cursor: 'grab' }}
              >
                <div className="flex items-center space-x-1.5">
                  <Checkbox 
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodoCompletion(todo.id)}
                    className="h-3.5 w-3.5"
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={cn(
                      "text-xs cursor-pointer",
                      todo.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {todo.text}
                  </label>
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
            ))
          ) : (
            <div className="text-xs text-muted-foreground text-center py-1.5 bg-background rounded-sm">
              No tasks for today
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendar;
