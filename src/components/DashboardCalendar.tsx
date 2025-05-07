import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ListTodo, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useAppContext } from '@/context/AppContext';

// Import the types from CalendarTypes
import { 
  Todo, 
  DroppedItem, 
  TaskFormValues 
} from './calendar/CalendarTypes';

// Import utilities from CalendarUtils
import { 
  getCrewDisplayCode, 
  getTextByItemType, 
  capitalizeFirstLetter, 
  safeToDateString, 
  isSameDay,
  formatDateToYYYYMMDD,
  ensureDate, 
  normalizeDate 
} from './calendar/CalendarUtils';

// Import the new components
import CalendarDayView from './calendar/CalendarDayView';
import CalendarDayCell from './calendar/CalendarDayCell';
import TaskFormDialog from './calendar/TaskFormDialog';
import EmployeeTaskDialog from './calendar/EmployeeTaskDialog';
import CrewTaskDialog from './calendar/CrewTaskDialog';
import TaskInput from './calendar/TaskInput';

const DashboardCalendar = () => {
  // Use the useAppContext hook to access todos and other data
  const { 
    crews, 
    todos: contextTodos, 
    setTodos: setContextTodos,
    calendarDate: contextDate,
    setCalendarDate: setContextDate
  } = useAppContext();
  
  const [selectedDate, setSelectedDate] = useState<Date>(contextDate ? new Date(contextDate) : new Date());
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  
  // Use the todos from context instead of local state
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employeeTaskDialogOpen, setEmployeeTaskDialogOpen] = useState(false);
  const [crewTaskDialogOpen, setCrewTaskDialogOpen] = useState(false);
  const [droppedItem, setDroppedItem] = useState<DroppedItem | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(contextDate ? new Date(contextDate) : new Date());

  // Update local selected date when context date changes
  useEffect(() => {
    if (contextDate) {
      // Ensure we're working with a Date object
      const newDate = typeof contextDate === 'string' ? new Date(contextDate) : contextDate;
      
      // Normalize the dates to avoid unnecessary re-renders due to time components
      if (!isSameDay(selectedDate, newDate)) {
        setSelectedDate(normalizeDate(newDate));
        setCurrentMonth(normalizeDate(newDate));
      }
    }
  }, [contextDate, selectedDate]);

  // Update context date when local selected date changes
  useEffect(() => {
    if (selectedDate) {
      const normalizedContextDate = contextDate ? normalizeDate(contextDate) : null;
      const normalizedSelectedDate = normalizeDate(selectedDate);
      
      // Only update if dates are actually different
      if (!normalizedContextDate || 
          normalizedSelectedDate.getTime() !== normalizedContextDate.getTime()) {
        setContextDate(normalizedSelectedDate);
      }
    }
  }, [selectedDate, contextDate, setContextDate]);

  // Process todos to ensure dates are Date objects and titles are defined
  const processedTodos = contextTodos.map(todo => ({
    ...todo,
    date: ensureDate(todo.date),
    title: todo.title || todo.text // Ensure title is set if missing
  }));

  const form = useForm<TaskFormValues>({
    defaultValues: {
      text: '',
      date: new Date(),
      location: '',
      startTime: '',
      endTime: '',
      assignedTo: ''
    },
  });

  const employeeTaskForm = useForm<TaskFormValues>({
    defaultValues: {
      text: '',
      date: new Date(),
      location: '',
      startTime: '',
      endTime: '',
    },
  });

  const crewTaskForm = useForm<TaskFormValues>({
    defaultValues: {
      text: '',
      date: new Date(),
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

  // Filter todos for the selected date using safeToDateString
  const todaysTodos = processedTodos.filter(
    todo => isSameDay(todo.date, selectedDate)
  );

  // Count tasks for each day
  const getTaskCountForDay = (date: Date): number => {
    return processedTodos.filter(todo => isSameDay(todo.date, date)).length;
  };

  const addTodo = (newTodoText: string) => {
    if (newTodoText.trim() === '') return;
    
    const newTodo = {
      id: Date.now().toString(),
      text: newTodoText,
      title: newTodoText, // Ensure title is always set
      completed: false,
      date: selectedDate
    };
    
    setContextTodos([...contextTodos, newTodo]);
    toast.success("Task created successfully");
  };

  const onSubmitNewTask = (values: TaskFormValues) => {
    const newTodo = {
      id: Date.now().toString(),
      text: values.text,
      title: values.text, // Ensure title is always set
      completed: false,
      date: values.date || selectedDate,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      assignedTo: values.assignedTo
    };
    
    setContextTodos([...contextTodos, newTodo]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Task created successfully");
  };

  const onSubmitEmployeeTask = (values: TaskFormValues) => {
    if (!droppedItem || droppedItem.type !== 'employee') return;

    const newTodo = {
      id: Date.now().toString(),
      text: values.text,
      title: values.text, // Ensure title is always set
      completed: false,
      date: values.date || selectedDate,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      assignedTo: droppedItem.originalData?.name || droppedItem.text.split(' - ')[1],
      assignedToAvatar: droppedItem.originalData?.avatarUrl
    };
    
    setContextTodos([...contextTodos, newTodo]);
    setEmployeeTaskDialogOpen(false);
    employeeTaskForm.reset();
    setDroppedItem(null);
    toast.success(`Task assigned to ${newTodo.assignedTo}`);
  };

  const onSubmitCrewTask = (values: TaskFormValues) => {
    if (!droppedItem || droppedItem.type !== 'crew') return;

    const crewName = droppedItem.originalData?.name || droppedItem.text.split(' - ')[1];
    const newTodo = {
      id: Date.now().toString(),
      text: values.text,
      title: values.text, // Ensure title is always set
      completed: false,
      date: values.date || selectedDate,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      crewId: droppedItem.id,
      crewName: crewName,
      crewMembers: droppedItem.originalData?.members || []
    };
    
    setContextTodos([...contextTodos, newTodo]);
    setCrewTaskDialogOpen(false);
    crewTaskForm.reset();
    setDroppedItem(null);
    toast.success(`Task assigned to ${crewName} crew`);
  };

  const toggleTodoCompletion = (id: string) => {
    setContextTodos(
      contextTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setContextTodos(contextTodos.filter(todo => todo.id !== id));
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

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Normalize the date before setting it
      const normalizedDate = normalizeDate(date);
      setSelectedDate(normalizedDate);
      setContextDate(normalizedDate);
      
      // If there's a todo being dragged, update its date
      if (draggedTodo) {
        const updatedTodos = contextTodos.map(todo => 
          todo.id === draggedTodo.id 
            ? { ...todo, date: normalizedDate } 
            : todo
        );
        setContextTodos(updatedTodos);
        setDraggedTodo(null);
        toast.success("Task moved to " + format(normalizedDate, 'MMM d, yyyy'));
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
    const newTodo = {
      id: `${droppedItem.type}-${droppedItem.id}-${Date.now()}`,
      text: getTextByItemType(droppedItem),
      title: getTextByItemType(droppedItem), // Add title for compatibility
      completed: false,
      date: date
    };

    setContextTodos([...contextTodos, newTodo]);
    toast.success(`${capitalizeFirstLetter(droppedItem.type)} added to calendar on ${format(date, 'MMM d, yyyy')}`);
  };

  const handleDayDrop = (date: Date, e: React.DragEvent) => {
    // Handle todo drops
    if (draggedTodo) {
      const updatedTodos = contextTodos.map(todo => 
        todo.id === draggedTodo.id 
          ? { ...todo, date } 
          : todo
      );
      setContextTodos(updatedTodos);
      setDraggedTodo(null);
      setIsDragging(false);
      setSelectedDate(date);
      setContextDate(date);
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
          setContextDate(date);
        }
      } catch (error) {
        console.error("Error processing dropped item:", error);
      }
    }
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
          onMonthChange={setCurrentMonth}
          className={cn("rounded-md border bg-card shadow-sm w-full", "pointer-events-auto")}
          components={{
            Day: (props) => (
              <CalendarDayCell 
                date={props.date} 
                selectedDate={selectedDate} 
                taskCount={getTaskCountForDay(props.date)} 
                isDragging={isDragging}
                onDateClick={(date) => {
                  setSelectedDate(date);
                  setContextDate(date);
                }}
                onDateDoubleClick={(date) => {
                  setSelectedDate(date);
                  setContextDate(date);
                  form.setValue('date', date);
                  setIsDialogOpen(true);
                }}
                onDrop={handleDayDrop}
                draggedTodo={draggedTodo}
              />
            )
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
          <Button 
            size="sm" 
            className="h-7 px-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only">Add Task</span>
          </Button>
        </div>
        
        <TaskInput onAddTodo={addTodo} />
        
        <div className="space-y-0.5 max-h-[100px] bg-card rounded-md p-1.5 overflow-y-auto">
          <CalendarDayView 
            todos={todaysTodos} 
            selectedDate={selectedDate}
            toggleTodoCompletion={toggleTodoCompletion}
            deleteTodo={deleteTodo}
            getCrewDisplayCode={(crewId) => getCrewDisplayCode(crewId, crews)}
          />
        </div>
      </div>

      {/* Task Dialogs */}
      <TaskFormDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={onSubmitNewTask}
        title="Add New Task"
      />

      <EmployeeTaskDialog
        isOpen={employeeTaskDialogOpen}
        onOpenChange={setEmployeeTaskDialogOpen}
        droppedItem={droppedItem}
        form={employeeTaskForm}
        onSubmit={onSubmitEmployeeTask}
      />
      
      <CrewTaskDialog 
        isOpen={crewTaskDialogOpen}
        onOpenChange={setCrewTaskDialogOpen}
        droppedItem={droppedItem}
        form={crewTaskForm}
        onSubmit={onSubmitCrewTask}
      />
    </div>
  );
};

export default DashboardCalendar;
