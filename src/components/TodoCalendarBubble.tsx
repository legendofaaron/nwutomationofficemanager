
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Calendar as CalendarIcon, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { type DayProps } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  assignedTo?: string;
  assignedToAvatars?: string[];
  crew?: string[];
}

const TodoCalendarBubble = () => {
  const { calendarDate, setCalendarDate, todos, setTodos } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(calendarDate || new Date());
  const [newTodoText, setNewTodoText] = useState('');
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  
  // Ref to close popover when clicking outside
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = "todo-calendar-bubble";

  // Update local selected date when global date changes
  useEffect(() => {
    if (calendarDate) {
      setSelectedDate(calendarDate);
    }
  }, [calendarDate]);

  // Update global date when local date changes
  useEffect(() => {
    setCalendarDate(selectedDate);
  }, [selectedDate, setCalendarDate]);

  // Listen for clicks outside popover to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          popoverRef.current && 
          !popoverRef.current.contains(event.target as Node) && 
          // Make sure we're not clicking the trigger button
          !(event.target as HTMLElement).closest('[data-state="open"]')) {
        setIsOpen(false);
      }
    };

    const handleCloseAllPopovers = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.exceptId !== popoverId) {
        setIsOpen(false);
      }
    };

    // Close when dashboard is clicked
    const handleDashboardClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only close if we're clicking directly on the dashboard content
      if (!target.closest('[role="dialog"]') && 
          !target.closest('[data-calendar]') &&
          !target.closest('.calendar-component')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('closeAllPopovers', handleCloseAllPopovers);
    document.addEventListener('click', handleDashboardClick);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('closeAllPopovers', handleCloseAllPopovers);
      document.removeEventListener('click', handleDashboardClick);
    };
  }, [isOpen]);

  const todaysTodos = todos.filter(
    todo => todo.date.toDateString() === selectedDate.toDateString()
  );

  // Count tasks for each day
  const getTaskCountForDay = (date: Date): number => {
    return todos.filter(todo => todo.date.toDateString() === date.toDateString()).length;
  };

  // Get assigned employees for a day
  const getAssignedEmployeesForDay = (date: Date): string[] => {
    const dayTodos = todos.filter(todo => todo.date.toDateString() === date.toDateString());
    const assignedEmployees = new Set<string>();
    
    dayTodos.forEach(todo => {
      if (todo.assignedTo) {
        assignedEmployees.add(todo.assignedTo);
      }
      if (todo.crew && todo.crew.length > 0) {
        todo.crew.forEach(employee => assignedEmployees.add(employee));
      }
    });
    
    return Array.from(assignedEmployees);
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
    toast.success("Task added successfully");
  };

  const toggleTodoCompletion = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success("Task deleted successfully");
  };

  // Updated drag and drop functionality
  const handleDragStart = (todo: Todo, e: React.DragEvent) => {
    setDraggedTodo(todo);
    e.dataTransfer.setData('text/plain', todo.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTodo(null);
  };

  // Fixed: Ensure the handleDateChange function properly updates selectedDate
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Set selected date and force a re-render of tasks
      setSelectedDate(new Date(date));
    }
  };

  // Custom day render to handle drops and clicks
  const customDayRender = (day: DayProps) => {
    const date = day.date;
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const taskCount = getTaskCountForDay(date);
    const dateValue = date.getDate();
    const assignedEmployees = getAssignedEmployeesForDay(date);
    
    return (
      <div 
        className="relative w-full h-full flex items-center justify-center"
        data-calendar="day-cell"
        onClick={() => handleDateChange(date)}
        onDragOver={(e) => {
          // Allow drop by preventing the default behavior
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Handle the drop - update the todo's date
          if (draggedTodo) {
            const updatedTodos = todos.map(todo => 
              todo.id === draggedTodo.id 
                ? { ...todo, date } 
                : todo
            );
            setTodos(updatedTodos);
            // Update the selected date to make the moved task visible
            setSelectedDate(new Date(date));
            toast.success(`Task moved to ${format(date, 'MMM d, yyyy')}`);
            setDraggedTodo(null);
          }
        }}
      >
        <div className={cn(
          "flex flex-col items-center justify-center",
          isSelected && "font-bold"
        )}>
          <span className="text-xs overflow-hidden text-center w-full">
            {dateValue}
          </span>
          
          {/* Task count badge */}
          {taskCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -bottom-1 px-1 py-0 min-w-4 h-3 text-[0.6rem] flex items-center justify-center"
            >
              {taskCount}
            </Badge>
          )}
          
          {/* Employee initials for assigned tasks */}
          {assignedEmployees.length > 0 && (
            <div className="absolute -top-1 -right-1 flex -space-x-1">
              {assignedEmployees.slice(0, 2).map((employee, index) => (
                <Avatar key={index} className="h-3 w-3 border border-background">
                  <AvatarFallback className="text-[0.5rem]">
                    {employee.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {assignedEmployees.length > 2 && (
                <Badge variant="secondary" className="h-3 w-3 rounded-full flex items-center justify-center text-[0.5rem] p-0">
                  +{assignedEmployees.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Total task count for the bubble badge - count only incomplete tasks
  const totalTaskCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg bg-primary relative"
          >
            <CalendarIcon className="h-5 w-5" />
            {totalTaskCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 px-1.5 min-w-5 h-5"
                variant="destructive"
              >
                {totalTaskCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          ref={popoverRef}
          className="w-80 p-0 bg-background border-2 calendar-component" 
          align="end"
          sideOffset={4}
          id={popoverId}
        >
          <Card className="shadow-lg border-0">
            <div className="flex justify-between items-center p-3 bg-card border-b">
              <h3 className="text-base flex items-center font-medium">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar & Tasks
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-3 bg-background">
              {/* Ensure pointer-events-auto is set on the Calendar component */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className="rounded-md border bg-card shadow-sm pointer-events-auto"
                components={{
                  Day: customDayRender
                }}
                data-calendar="calendar"
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    Tasks for {format(selectedDate, 'MMM d, yyyy')}
                  </h3>
                  <Badge variant="outline">{todaysTodos.length}</Badge>
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
                        draggable={true}
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
                        
                        {/* Show assigned employees */}
                        {(todo.assignedTo || (todo.crew && todo.crew.length > 0)) && (
                          <div className="flex -space-x-1">
                            {todo.assignedTo && (
                              <Avatar className="h-5 w-5 border border-background">
                                <AvatarFallback className="text-[0.6rem]">
                                  {todo.assignedTo.substring(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            {todo.crew && todo.crew.map((member, idx) => (
                              <Avatar key={idx} className="h-5 w-5 border border-background">
                                <AvatarFallback className="text-[0.6rem]">
                                  {member.substring(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        )}
                        
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
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TodoCalendarBubble;
