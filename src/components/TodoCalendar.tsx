import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, Plus, ListTodo, Calendar as CalendarIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { type DayProps } from 'react-day-picker';
import { toast } from 'sonner';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  assignedTo?: string;
  crewMembers?: string[];
  crewId?: string;
  crewName?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

const TodoCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [newTodoText, setNewTodoText] = useState('');
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragImageRef = useRef<HTMLDivElement | null>(null);
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Team meeting', completed: false, date: new Date() },
    { id: '2', text: 'Review project proposal', completed: true, date: new Date() },
    { id: '3', text: 'Call with client', completed: false, date: new Date() },
  ]);

  // Create drag image element on mount
  useEffect(() => {
    const dragImage = document.createElement('div');
    dragImage.className = 'task-drag-preview';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    
    dragImageRef.current = dragImage;
    
    return () => {
      if (dragImage && document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    };
  }, []);

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
    toast?.success("Task added successfully");
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
    toast?.success("Task removed");
  };

  // Enhanced drag and drop functionality
  const handleDragStart = (todo: Todo, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedTodo(todo);
    setIsDragging(true);
    
    // Set drag effect and image
    e.dataTransfer.effectAllowed = "move";
    
    // Use our ref for the drag image
    if (dragImageRef.current) {
      dragImageRef.current.textContent = todo.text;
      dragImageRef.current.className = 'bg-primary text-white px-2 py-1 rounded text-xs';
      document.body.appendChild(dragImageRef.current);
      e.dataTransfer.setDragImage(dragImageRef.current, 10, 10);
    }
    
    // Set data transfer
    const stringifiedData = JSON.stringify({
      id: todo.id,
      text: todo.text,
      type: 'todo',
      originalData: todo
    });
    
    e.dataTransfer.setData('application/json', stringifiedData);
    e.dataTransfer.setData('text/plain', todo.text);
  };

  const handleDragEnd = () => {
    setDraggedTodo(null);
    setIsDragging(false);
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
        toast?.success(`Task moved to ${format(date, 'MMM d, yyyy')}`);
      }
    }
  };

  // Custom day render to show task indicators and handle drops
  const customDayRender = (day: DayProps) => {
    const date = day.date;
    if (!date) return null;
    
    // Check if the current day is selected by comparing dates
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const taskCount = getTaskCountForDay(date);
    const dateValue = date.getDate();
    
    return (
      <div 
        className={cn(
          "relative w-full h-full flex items-center justify-center",
          isDragging && "cursor-copy drop-shadow-sm",
          "hover:bg-accent/10 transition-colors cursor-pointer"
        )}
        onClick={() => setSelectedDate(date)}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Add visual feedback (safely)
          if (e.currentTarget) {
            e.currentTarget.classList.add("bg-accent/30");
          }
        }}
        onDragLeave={(e) => {
          // Remove visual feedback (safely)
          if (e.currentTarget) {
            e.currentTarget.classList.remove("bg-accent/30");
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          
          // Remove visual feedback (safely)
          if (e.currentTarget) {
            e.currentTarget.classList.remove("bg-accent/30");
          }
          
          if (draggedTodo) {
            const updatedTodos = todos.map(todo => 
              todo.id === draggedTodo.id 
                ? { ...todo, date } 
                : todo
            );
            setTodos(updatedTodos);
            setDraggedTodo(null);
            setIsDragging(false);
            setSelectedDate(date);
            toast?.success(`Task moved to ${format(date, 'MMM d, yyyy')}`);
          }
          
          // Add support for other dragged items from dashboard
          try {
            const data = e.dataTransfer.getData("application/json");
            if (data) {
              const item = JSON.parse(data);
              if (item.type === 'booking' || item.type === 'employee' || item.type === 'crew' || item.type === 'todo') {
                const newTodo: Todo = {
                  id: Date.now().toString(),
                  text: item.text || "New task",
                  completed: false,
                  date: date,
                  assignedTo: item.originalData?.assignedTo || item.originalData?.name,
                };
                
                setTodos([...todos, newTodo]);
                toast?.success(`Item added to calendar on ${format(date, 'MMM d, yyyy')}`);
              }
            }
          } catch (error) {
            console.error("Error processing drop:", error);
          }
        }}
      >
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
    <div className="fixed top-14 right-0 z-40 w-80">
      <Card className="shadow-lg bg-background border-2 rounded-t-none border-t-0">
        <Collapsible defaultOpen={true}>
          <CardHeader className="p-3 bg-card">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar & Tasks
              </CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  {true ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent className="p-3 bg-background">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className={cn("rounded-md border bg-[#2A2A2A] shadow-sm", "pointer-events-auto")}
                components={{
                  Day: customDayRender
                }}
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <ListTodo className="h-4 w-4 mr-2" />
                  <h3 className="text-sm font-medium">
                    Tasks for {format(selectedDate, 'MMM d, yyyy')}
                  </h3>
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add new task..."
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    className="h-8 text-sm bg-background"
                  />
                  <Button onClick={addTodo} size="sm" className="h-8 px-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-1 max-h-36 overflow-y-auto py-1 bg-card rounded-md p-2">
                  {todaysTodos.length > 0 ? (
                    todaysTodos.map((todo) => (
                      <div 
                        key={todo.id} 
                        className="flex items-center justify-between space-x-2 text-sm bg-background rounded-sm p-1"
                        draggable
                        onDragStart={(e) => handleDragStart(todo, e)}
                        onDragEnd={handleDragEnd}
                        style={{ cursor: 'grab' }}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`todo-${todo.id}`}
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodoCompletion(todo.id)}
                          />
                          <label
                            htmlFor={`todo-${todo.id}`}
                            className={cn(
                              "text-sm cursor-pointer",
                              todo.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {todo.text}
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          &times;
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-2 bg-background rounded-sm">
                      No tasks for today
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default TodoCalendar;
