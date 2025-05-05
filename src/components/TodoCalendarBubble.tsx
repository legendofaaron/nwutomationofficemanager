import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Calendar as CalendarIcon, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { type DayProps } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  assignedTo?: string;
  assignedToAvatars?: string[];
  crew?: string[];
  location?: string;
  startTime?: string;
  endTime?: string;
}

interface DraggedItem {
  type: 'employee' | 'invoice' | 'todo';
  id: string;
  name: string;
  originalData: any;
}

const TodoCalendarBubble = () => {
  const { calendarDate, setCalendarDate, todos, setTodos, employees, crews } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(calendarDate || new Date());
  const [newTodoText, setNewTodoText] = useState('');
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Office',
    assignedTo: '',
    assignedCrew: ''
  });
  
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

  // Remove the click outside handler to keep popover open
  // We'll still listen for the explicit closeAllPopovers event
  useEffect(() => {
    const handleCloseAllPopovers = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.exceptId !== popoverId) {
        setIsOpen(false);
      }
    };

    document.addEventListener('closeAllPopovers', handleCloseAllPopovers);
    
    return () => {
      document.removeEventListener('closeAllPopovers', handleCloseAllPopovers);
    };
  }, [isOpen]);

  // Listen for dragover events at the document level
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault(); // Necessary to allow dropping
      
      // Check if the popover is not open and the dragover is over the calendar bubble
      if (!isOpen && e.target) {
        const targetElement = e.target as HTMLElement;
        const calendarBubble = document.querySelector('[data-calendar-bubble="true"]');
        
        // If dragging over the calendar button when closed, open it
        if (calendarBubble && (calendarBubble === targetElement || calendarBubble.contains(targetElement))) {
          setIsOpen(true);
        }
      }
    };
    
    document.addEventListener('dragover', handleDragOver);
    
    return () => {
      document.removeEventListener('dragover', handleDragOver);
    };
  }, [isOpen]);

  // Listen for drop events at the document level for handling external drops
  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      
      try {
        const dragData = e.dataTransfer?.getData('application/json');
        if (dragData) {
          const parsedData = JSON.parse(dragData);
          
          if (parsedData.type === 'employee' || parsedData.type === 'invoice') {
            // Open calendar if closed
            if (!isOpen) {
              setIsOpen(true);
            }
            
            // Set dragged item data for task creation
            setDraggedItem({
              type: parsedData.type,
              id: parsedData.id,
              name: parsedData.text,
              originalData: parsedData.originalData
            });
            
            // Open task dialog
            setTimeout(() => {
              setIsTaskDialogOpen(true);
            }, 100);
          }
        }
      } catch (error) {
        console.error("Error parsing drag data:", error);
      }
    };
    
    document.addEventListener('drop', handleDrop);
    
    return () => {
      document.removeEventListener('drop', handleDrop);
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

  // Create a new task based on dragged item or manual creation
  const handleCreateTask = () => {
    if (!newTask.title) {
      toast.error("Please provide a task title");
      return;
    }
    
    // Create basic task data
    const taskData: Todo = {
      id: Date.now().toString(),
      text: newTask.title,
      completed: false,
      date: selectedDate,
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      location: newTask.location
    };
    
    // Add assignee data if we have a dragged employee
    if (draggedItem?.type === 'employee') {
      const employeeName = draggedItem.name.split(' - ')[1] || draggedItem.name;
      taskData.assignedTo = employeeName;
    } else if (newTask.assignedTo) {
      // Or use manually selected assignee
      taskData.assignedTo = newTask.assignedTo;
    }
    
    // Add crew assignment if one is selected
    if (newTask.assignedCrew) {
      // Find the selected crew
      const selectedCrew = crews.find(crew => crew.id === newTask.assignedCrew);
      if (selectedCrew) {
        // Get the names of all crew members
        const crewMemberNames = selectedCrew.members.map(memberId => {
          const employee = employees.find(emp => emp.id === memberId);
          return employee ? employee.name : '';
        }).filter(name => name !== '');
        
        taskData.crew = crewMemberNames;
      }
    }
    
    // Create special task text for invoices
    if (draggedItem?.type === 'invoice') {
      const invoiceId = draggedItem.originalData.id;
      const clientName = draggedItem.originalData.clientName;
      taskData.text = `Process invoice ${invoiceId} for ${clientName}`;
    }
    
    // Add to todos
    setTodos([...todos, taskData]);
    
    // Reset states
    setIsTaskDialogOpen(false);
    setDraggedItem(null);
    setNewTask({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      location: 'Office',
      assignedTo: '',
      assignedCrew: ''
    });
    
    toast.success("Task scheduled successfully");
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
          
          try {
            // Check if we have a dragged JSON item first
            const dragData = e.dataTransfer.getData('application/json');
            if (dragData) {
              const parsedData = JSON.parse(dragData);
              
              if (parsedData.type === 'employee' || parsedData.type === 'invoice') {
                setDraggedItem({
                  type: parsedData.type,
                  id: parsedData.id,
                  name: parsedData.text,
                  originalData: parsedData.originalData
                });
                
                // Update the selected date to the drop target date
                setSelectedDate(new Date(date));
                
                // Open task dialog
                setIsTaskDialogOpen(true);
                return;
              }
            }
            
            // Fall back to handling todo drags
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
          } catch (error) {
            console.error("Error handling drop:", error);
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

  // Get employee options for select
  const getEmployeeOptions = () => {
    return employees.map(employee => (
      <SelectItem key={employee.id} value={employee.name}>
        {employee.name}
      </SelectItem>
    ));
  };

  // Get crew options for select
  const getCrewOptions = () => {
    return crews.map(crew => (
      <SelectItem key={crew.id} value={crew.id}>
        {crew.name} ({crew.members.length} members)
      </SelectItem>
    ));
  };

  // Helper to get crew member names for display
  const getCrewMemberNames = (crewId: string) => {
    const crew = crews.find(c => c.id === crewId);
    if (!crew) return "No members";
    
    const memberNames = crew.members.map(memberId => {
      const employee = employees.find(emp => emp.id === memberId);
      return employee ? employee.name : "";
    }).filter(Boolean);
    
    return memberNames.join(", ");
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg bg-primary relative"
            data-calendar-bubble="true"
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

      {/* Task Creation Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Task</DialogTitle>
            <DialogDescription>
              {draggedItem ? (
                draggedItem.type === 'employee' 
                  ? `Create a task for ${draggedItem.name}`
                  : `Schedule processing for ${draggedItem.name}`
              ) : (
                'Create a new task'
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input 
                  id="task-title"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <div className="border rounded-md p-2 bg-muted/30">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input 
                    id="start-time" 
                    type="time" 
                    value={newTask.startTime}
                    onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={newTask.endTime}
                    onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Location" 
                  value={newTask.location}
                  onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="assignment" className="space-y-4 py-4">
              {/* Individual Assignment */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <Label htmlFor="assigned-to">Assign to Individual</Label>
                </div>
                {!draggedItem || draggedItem.type !== 'employee' ? (
                  <Select 
                    value={newTask.assignedTo} 
                    onValueChange={value => setNewTask({...newTask, assignedTo: value})}
                  >
                    <SelectTrigger id="assigned-to">
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No individual assignment</SelectItem>
                      {getEmployeeOptions()}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="border rounded-md p-2 bg-muted/30">
                    {draggedItem.name}
                  </div>
                )}
              </div>
              
              {/* OR divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              {/* Crew Assignment */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <Label htmlFor="assigned-crew">Assign to Crew</Label>
                </div>
                <Select 
                  value={newTask.assignedCrew} 
                  onValueChange={value => setNewTask({...newTask, assignedCrew: value})}
                >
                  <SelectTrigger id="assigned-crew">
                    <SelectValue placeholder="Select a crew" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No crew assignment</SelectItem>
                    {getCrewOptions()}
                  </SelectContent>
                </Select>
                
                {newTask.assignedCrew && (
                  <div className="mt-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                    <strong>Crew members:</strong> {getCrewMemberNames(newTask.assignedCrew)}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleCreateTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoCalendarBubble;
