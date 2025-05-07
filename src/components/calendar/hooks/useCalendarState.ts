
import { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Todo, DroppedItem } from '../CalendarTypes';
import { normalizeDate, ensureDate, isSameDay } from '../CalendarUtils';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { TaskFormValues } from '../CalendarTypes';

// Custom hook to handle calendar state
export const useCalendarState = () => {
  const { 
    crews, 
    todos: contextTodos, 
    setTodos: setContextTodos,
    calendarDate: contextDate,
    setCalendarDate: setContextDate
  } = useAppContext();
  
  // Normalize the initial date from context to avoid time component issues
  const initialDate = useMemo(() => {
    return contextDate ? 
      normalizeDate(typeof contextDate === 'string' ? new Date(contextDate) : contextDate) : 
      normalizeDate(new Date());
  }, [contextDate]);
  
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employeeTaskDialogOpen, setEmployeeTaskDialogOpen] = useState(false);
  const [crewTaskDialogOpen, setCrewTaskDialogOpen] = useState(false);
  const [droppedItem, setDroppedItem] = useState<DroppedItem | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);
  
  // Init form states
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
  
  // Date synchronization between context and local state - with optimizations to prevent loops
  useEffect(() => {
    if (contextDate) {
      // Ensure we're working with a normalized Date object
      const normalizedContextDate = normalizeDate(
        typeof contextDate === 'string' ? new Date(contextDate) : contextDate
      );
      const normalizedSelectedDate = normalizeDate(selectedDate);
      
      // Only update if dates are actually different by comparing timestamps
      if (normalizedSelectedDate.getTime() !== normalizedContextDate.getTime()) {
        setSelectedDate(normalizedContextDate);
        // Also update month view for consistency
        setCurrentMonth(new Date(
          normalizedContextDate.getFullYear(),
          normalizedContextDate.getMonth(),
          1
        ));
      }
    }
  }, [contextDate, selectedDate]);

  // Update context date when local selected date changes - with optimizations to prevent loops
  useEffect(() => {
    const normalizedSelectedDate = normalizeDate(selectedDate);
    
    // Check if we need to update the context
    if (!contextDate) {
      setContextDate(normalizedSelectedDate);
      return;
    }
    
    // Convert string dates to Date objects for comparison
    const contextDateObj = typeof contextDate === 'string' ? new Date(contextDate) : contextDate;
    const normalizedContextDate = normalizeDate(contextDateObj);
    
    // Only update if the dates are truly different
    if (normalizedContextDate.getTime() !== normalizedSelectedDate.getTime()) {
      setContextDate(normalizedSelectedDate);
    }
  }, [selectedDate, contextDate, setContextDate]);

  // Process todos to ensure dates are Date objects and titles are defined - memoized to prevent unnecessary processing
  const processedTodos = useMemo(() => {
    return contextTodos.map(todo => ({
      ...todo,
      date: ensureDate(todo.date),
      title: todo.title || todo.text // Ensure title is set if missing
    }));
  }, [contextTodos]);

  // Filter todos for the selected date using isSameDay for reliable comparison - memoized to prevent recalculation
  const todaysTodos = useMemo(() => {
    return processedTodos.filter(
      todo => isSameDay(todo.date, selectedDate)
    );
  }, [processedTodos, selectedDate]);

  // Count tasks for each day - memoized function to improve performance
  const getTaskCountForDay = useMemo(() => {
    const countMap = processedTodos.reduce((acc, todo) => {
      const dateKey = todo.date.toDateString();
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return (date: Date): number => {
      return countMap[date.toDateString()] || 0;
    };
  }, [processedTodos]);

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

  return {
    // State
    selectedDate,
    setSelectedDate,
    draggedTodo,
    setDraggedTodo,
    isDragging,
    setIsDragging,
    isDialogOpen,
    setIsDialogOpen,
    employeeTaskDialogOpen,
    setEmployeeTaskDialogOpen,
    crewTaskDialogOpen,
    setCrewTaskDialogOpen,
    droppedItem,
    setDroppedItem,
    calendarRef,
    currentMonth,
    setCurrentMonth,
    
    // Forms
    form,
    employeeTaskForm,
    crewTaskForm,
    
    // Data
    crews,
    processedTodos,
    todaysTodos,
    contextTodos,
    setContextTodos,
    
    // Utilities
    getTaskCountForDay
  };
};
