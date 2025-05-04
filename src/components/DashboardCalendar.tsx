
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ListTodo, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { type DayProps } from 'react-day-picker';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

interface TaskFormValues {
  text: string;
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
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const form = useForm<TaskFormValues>({
    defaultValues: {
      text: '',
      date: new Date(),
    },
  });

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
    toast.success("Task created successfully");
  };

  const onSubmitNewTask = (values: TaskFormValues) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: values.text,
      completed: false,
      date: values.date || selectedDate
    };
    
    setTodos([...todos, newTodo]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Task created successfully");
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
    toast.info("Task removed");
  };

  // Enhanced drag and drop functionality
  const handleDragStart = (todo: Todo, e: React.DragEvent) => {
    setDraggedTodo(todo);
    setIsDragging(true);
    
    // Set a custom drag image (optional)
    const dragImage = document.createElement('div');
    dragImage.innerHTML = `<div class="bg-primary text-white px-2 py-1 rounded text-xs">${todo.text}</div>`;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up after drag operation starts
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggedTodo(null);
    setIsDragging(false);
  };

  // Allow calendar to receive dragged tasks
  const handleCalendarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
        toast.success("Task moved to " + format(date, 'MMM d, yyyy'));
      }
    }
  };

  // Custom day render to show task indicators and handle drops
  const customDayRender = (day: DayProps) => {
    const date = day.date;
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
        onClick={() => {
          setSelectedDate(date);
        }}
        onDoubleClick={() => {
          setSelectedDate(date);
          form.setValue('date', date);
          setIsDialogOpen(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedTodo) {
            const updatedTodos = todos.map(todo => 
              todo.id === draggedTodo.id 
                ? { ...todo, date } 
                : todo
            );
            setTodos(updatedTodos);
            setDraggedTodo(null);
            setIsDragging(false);
            // Update selected date to the drop target date
            setSelectedDate(date);
            toast.success("Task moved to " + format(date, 'MMM d, yyyy'));
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
    <div className="h-full flex flex-col">
      <div 
        ref={calendarRef}
        onDragOver={handleCalendarDragOver}
        className="flex-shrink-0 w-full"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          className={cn("rounded-md border bg-card shadow-sm w-full", "pointer-events-auto")}
          components={{
            Day: customDayRender
          }}
        />
      </div>
      
      <div className="flex-grow overflow-auto mt-2 min-h-0">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center">
            <ListTodo className="h-4 w-4 mr-1.5" />
            <h3 className="text-sm font-medium">
              Tasks for {format(selectedDate, 'MMM d, yyyy')}
            </h3>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 px-2">
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only">Add Task</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmitNewTask)} className="space-y-4 mt-2">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task description..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                      />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                className={cn(
                  "flex items-center justify-between space-x-1.5 text-xs bg-background rounded-sm p-1",
                  "hover:bg-accent/20 transition-colors"
                )}
                draggable
                onDragStart={(e) => handleDragStart(todo, e)}
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
