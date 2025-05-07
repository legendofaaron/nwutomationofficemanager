
import { useState, useEffect, useRef } from 'react';
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
  const initialDate = contextDate ? 
    normalizeDate(typeof contextDate === 'string' ? new Date(contextDate) : contextDate) : 
    normalizeDate(new Date());
  
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
  
  // Date synchronization between context and local state
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
        setCurrentMonth(new Date(normalizedContextDate)); // Also update month view
      }
    }
  }, [contextDate, selectedDate]);

  // Update context date when local selected date changes
  useEffect(() => {
    const normalizedSelectedDate = normalizeDate(selectedDate);
    
    // Check if we need to update the context
    if (!contextDate || 
        (typeof contextDate === 'string' && normalizeDate(new Date(contextDate)).getTime() !== normalizedSelectedDate.getTime()) ||
        (contextDate instanceof Date && normalizeDate(contextDate).getTime() !== normalizedSelectedDate.getTime())) {
      setContextDate(normalizedSelectedDate);
    }
  }, [selectedDate, contextDate, setContextDate]);

  // Process todos to ensure dates are Date objects and titles are defined
  const processedTodos = contextTodos.map(todo => ({
    ...todo,
    date: ensureDate(todo.date),
    title: todo.title || todo.text // Ensure title is set if missing
  }));

  // Filter todos for the selected date using isSameDay for reliable comparison
  const todaysTodos = processedTodos.filter(
    todo => isSameDay(todo.date, selectedDate)
  );

  // Count tasks for each day
  const getTaskCountForDay = (date: Date): number => {
    return processedTodos.filter(todo => isSameDay(todo.date, date)).length;
  };

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
