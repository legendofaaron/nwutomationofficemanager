import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, getCrewLetterCode } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ListTodo, Calendar as CalendarIcon, MapPin, Clock, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { type DayProps } from 'react-day-picker';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  assignedTo?: string;
  assignedToAvatar?: string;
  crewId?: string;
  crewName?: string;
  crewMembers?: string[];
  location?: string;
  startTime?: string;
  endTime?: string;
}

interface TaskFormValues {
  text: string;
  date: Date;
  location?: string;
  startTime?: string;
  endTime?: string;
  assignedTo?: string;
}

// Define types for the different items that can be dropped
interface DroppedItem {
  id: string;
  text: string;
  type: 'employee' | 'crew' | 'invoice' | 'booking' | 'todo';
  originalData?: any;
}

const DashboardCalendar = () => {
  // Add the useAppContext hook to access crews and calendar date
  const { crews, calendarDate, setCalendarDate, todos, setTodos } = useAppContext();
  
  // Use the global calendar date
  const [selectedDate, setSelectedDate] = useState<Date>(calendarDate || new Date());
  const [newTodoText, setNewTodoText] = useState('');
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employeeTaskDialogOpen, setEmployeeTaskDialogOpen] = useState(false);
  const [crewTaskDialogOpen, setCrewTaskDialogOpen] = useState(false);
  const [droppedItem, setDroppedItem] = useState<DroppedItem | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Sync local selected date with global date
  useEffect(() => {
    if (calendarDate) {
      setSelectedDate(calendarDate);
    }
  }, [calendarDate]);
  
  // Update global state when local date changes
  useEffect(() => {
    setCalendarDate(selectedDate);
  }, [selectedDate, setCalendarDate]);

  const form = useForm<TaskFormValues>({
    defaultValues: {
      text: '',
      date: selectedDate,
      location: '',
      startTime: '',
      endTime: '',
      assignedTo: ''
    },
  });

  const employeeTaskForm = useForm<TaskFormValues>({
    defaultValues: {
      text: '',
      date: selectedDate,
      location: '',
      startTime: '',
      endTime: '',
    },
  });

  const crewTaskForm = useForm<TaskFormValues>({
    defaultValues: {
      text: '',
      date: selectedDate,
      location: '',
      startTime: '',
      endTime: '',
    },
  });

  // Listen for dragover events at the document level
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault(); // Necessary to allow dropping
    };
    
    document.addEventListener('dragover', handleDragOver);
    
    return () => {
      document.removeEventListener('dragover', handleDragOver);
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
    toast.success("Task created successfully");
  };

  const onSubmitNewTask = (values: TaskFormValues) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: values.text,
      completed: false,
      date: values.date || selectedDate,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      assignedTo: values.assignedTo
    };
    
    setTodos([...todos, newTodo]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Task created successfully");
  };

  const onSubmitEmployeeTask = (values: TaskFormValues) => {
    if (!droppedItem || droppedItem.type !== 'employee') return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: values.text,
      completed: false,
      date: values.date || selectedDate,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      assignedTo: droppedItem.originalData?.name || droppedItem.text.split(' - ')[1],
      assignedToAvatar: droppedItem.originalData?.avatarUrl
    };
    
    setTodos([...todos, newTodo]);
    setEmployeeTaskDialogOpen(false);
    employeeTaskForm.reset();
    setDroppedItem(null);
    toast.success(`Task assigned to ${newTodo.assignedTo}`);
  };

  const onSubmitCrewTask = (values: TaskFormValues) => {
    if (!droppedItem || droppedItem.type !== 'crew') return;

    const crewName = droppedItem.originalData?.name || droppedItem.text.split(' - ')[1];
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: values.text,
      completed: false,
      date: values.date || selectedDate,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      crewId: droppedItem.id,
      crewName: crewName,
      crewMembers: droppedItem.originalData?.members || []
    };
    
    setTodos([...todos, newTodo]);
    setCrewTaskDialogOpen(false);
    crewTaskForm.reset();
    setDroppedItem(null);
    toast.success(`Task assigned to ${crewName} crew`);
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
    
    // Set the data transfer for todos
    e.dataTransfer.setData("application/json", JSON.stringify({
      id: todo.id,
      text: todo.text,
      type: 'todo',
      originalData: todo
    }));
    
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

  // Handle date change and sync with global state
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCalendarDate(date);
      
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

  // Handle dropped items from other components
  const handleExternalItemDrop = (droppedItem: DroppedItem, date: Date) => {
    // Open appropriate dialog based on the item type
    if (droppedItem.type === 'employee') {
      setDroppedItem(droppedItem);
      employeeTaskForm.setValue('date', date);
      setEmployeeTaskDialogOpen(true);
      return;
    }
    
    if (droppedItem.type === 'crew') {
      setDroppedItem(droppedItem);
      crewTaskForm.setValue('date', date);
      setCrewTaskDialogOpen(true);
      return;
    }
    
    // For other types, create a new todo directly
    const newTodo: Todo = {
      id: `${droppedItem.type}-${droppedItem.id}-${Date.now()}`,
      text: getTextByItemType(droppedItem),
      completed: false,
      date: date
    };

    setTodos([...todos, newTodo]);
    toast.success(`${capitalizeFirstLetter(droppedItem.type)} added to calendar on ${format(date, 'MMM d, yyyy')}`);
  };

  // Helper function to format the text based on item type
  const getTextByItemType = (item: DroppedItem): string => {
    switch(item.type) {
      case 'employee':
        return `Meeting with ${item.originalData?.name || item.text.split(' - ')[1]}`;
      case 'crew':
        return `Team meeting: ${item.originalData?.name || item.text.split(' - ')[1]}`;
      case 'invoice':
        return `Process invoice: ${item.text}`;
      case 'booking':
        return `Booking: ${item.text}`;
      default:
        return item.text;
    }
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
          isDragging && "cursor-copy drop-shadow-sm border-2 border-dashed border-primary/50",
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
          // Add visual feedback
          e.currentTarget.classList.add("bg-accent/30", "border-primary");
        }}
        onDragLeave={(e) => {
          // Remove visual feedback
          e.currentTarget.classList.remove("bg-accent/30", "border-primary");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("bg-accent/30", "border-primary");

          // Handle todo drops
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
            toast.success("Task moved to " + format(date, 'MMM d, yyyy'));
          } else {
            // Handle external drops (employees, crews, invoices, bookings)
            try {
              const droppedData = e.dataTransfer.getData("application/json");
              if (droppedData) {
                const droppedItem: DroppedItem = JSON.parse(droppedData);
                handleExternalItemDrop(droppedItem, date);
                // Update selected date to where the item was dropped
                setSelectedDate(date);
              }
            } catch (error) {
              console.error("Error processing dropped item:", error);
            }
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
          {taskCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -bottom-1 px-1 py-0 min-w-4 h-3 text-[0.6rem] flex items-center justify-center"
            >
              {taskCount}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // Helper function to get crew display code
  const getCrewDisplayCode = (crewId: string): string => {
    const crewIndex = crews ? crews.findIndex(crew => crew.id === crewId) : -1;
    return crewIndex >= 0 ? getCrewLetterCode(crewIndex) : '';
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
          month={currentMonth}
          onMonthChange={(date) => {
            setCurrentMonth(date);
            // Don't update selectedDate on month change
          }}
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
                        className="rounded-md border pointer-events-auto"
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
            ))
          ) : (
            <div className="text-xs text-muted-foreground text-center py-1.5 bg-background rounded-sm">
              No tasks for today
            </div>
          )}
        </div>
      </div>

      {/* Employee Task Assignment Dialog */}
      <Dialog open={employeeTaskDialogOpen} onOpenChange={setEmployeeTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {droppedItem && droppedItem.type === 'employee' ? (
                <div className="flex items-center gap-2">
                  <span>Assign Task to {droppedItem.originalData?.name || droppedItem.text.split(' - ')[1]}</span>
                  {droppedItem.originalData?.avatarUrl && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={droppedItem.originalData.avatarUrl} />
                      <AvatarFallback>
                        {(droppedItem.originalData?.name || droppedItem.text.split(' - ')[1]).substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ) : (
                "Assign New Task"
              )}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={employeeTaskForm.handleSubmit(onSubmitEmployeeTask)} className="space-y-4 mt-2">
            <FormField
              control={employeeTaskForm.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Input placeholder="What needs to be done?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={employeeTaskForm.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={employeeTaskForm.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={employeeTaskForm.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Where will this take place?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={employeeTaskForm.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date: {format(field.value, 'MMMM d, yyyy')}</FormLabel>
                  <FormControl>
                    <div className="hidden">
                      <Input {...field} type="hidden" value={field.value.toISOString()} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEmployeeTaskDialogOpen(false)}>Cancel</Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Crew Task Assignment Dialog */}
      <Dialog open={crewTaskDialogOpen} onOpenChange={setCrewTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {droppedItem && droppedItem.type === 'crew' ? (
                <div className="flex items-center gap-2">
                  <span>Assign Task to {droppedItem.originalData?.name || droppedItem.text.split(' - ')[1]} Crew</span>
                  <Badge variant="outline" className="ml-2">
                    {droppedItem.originalData?.memberCount || 0} members
                  </Badge>
                </div>
              ) : (
                "Assign New Crew Task"
              )}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={crewTaskForm.handleSubmit(onSubmitCrewTask)} className="space-y-4 mt-2">
            <FormField
              control={crewTaskForm.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Input placeholder="What does the crew need to do?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={crewTaskForm.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={crewTaskForm.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={crewTaskForm.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Where will this take place?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {droppedItem?.originalData?.members && droppedItem.originalData.members.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Crew Members</FormLabel>
                <div className="bg-muted/30 p-2 rounded-md flex flex-wrap gap-1">
                  {droppedItem.originalData.members.map((member: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <FormField
              control={crewTaskForm.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date: {format(field.value, 'MMMM d, yyyy')}</FormLabel>
                  <FormControl>
                    <div className="hidden">
                      <Input {...field} type="hidden" value={field.value.toISOString()} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCrewTaskDialogOpen(false)}>Cancel</Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Create Crew Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardCalendar;
