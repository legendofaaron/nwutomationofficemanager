
import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Task } from '../ScheduleTypes';
import { normalizeDate, isSameDay } from '@/components/calendar/CalendarUtils';
import { toast } from 'sonner';
import { isEqual } from 'lodash'; // Use deep object comparison

// Custom hook for managing tasks in the Schedule view
export const useScheduleTasks = () => {
  const { 
    employees, 
    crews, 
    clients, 
    clientLocations, 
    calendarDate, 
    setCalendarDate,
    todos,
    setTodos 
  } = useAppContext();
  
  // Use normalized date to ensure consistency with other calendar components
  const [selectedDate, setSelectedDate] = useState<Date>(
    calendarDate ? 
      (typeof calendarDate === 'string' ? new Date(calendarDate) : calendarDate) : 
      new Date()
  );
  
  // Convert todos to tasks format for this view
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Convert todos from AppContext to tasks - memoize to prevent unnecessary updates
  const convertTodosToTasks = useCallback(() => {
    if (!todos) return [];
    
    return todos.map(todo => ({
      id: todo.id,
      title: todo.text || todo.title || '',
      date: todo.date instanceof Date ? new Date(todo.date) : new Date(todo.date),
      completed: todo.completed,
      assignedTo: todo.assignedTo,
      crew: todo.crew,
      startTime: todo.startTime,
      endTime: todo.endTime,
      location: todo.location,
      clientId: todo.clientId,
      clientLocationId: todo.clientLocationId,
      description: todo.description,
      crewId: todo.crewId,
      crewName: todo.crewName || '' // Add default empty string to fix TypeScript error
    }));
  }, [todos]);
  
  // Effect to update tasks when todos change, using deep comparison
  useEffect(() => {
    const convertedTasks = convertTodosToTasks();
    
    // Use deep comparison to prevent unnecessary updates
    if (convertedTasks.length !== tasks.length || !isEqual(convertedTasks, tasks)) {
      setTasks(convertedTasks);
    }
  }, [todos, convertTodosToTasks, tasks]);
  
  // Effect to synchronize selected date with App context
  useEffect(() => {
    if (!calendarDate) return;
    
    const contextDateObj = typeof calendarDate === 'string' ? new Date(calendarDate) : calendarDate;
    const normalizedContextDate = normalizeDate(contextDateObj);
    const normalizedSelectedDate = normalizeDate(selectedDate);
    
    // Only update if dates are truly different (comparing timestamps)
    if (normalizedSelectedDate.getTime() !== normalizedContextDate.getTime()) {
      setSelectedDate(normalizedContextDate);
    }
  }, [calendarDate]);

  // Effect to update global state when local selected date changes
  useEffect(() => {
    const normalizedSelectedDate = normalizeDate(selectedDate);
    
    // Only update the context if necessary
    if (!calendarDate) {
      setCalendarDate(normalizedSelectedDate);
      return;
    }
    
    const contextDate = typeof calendarDate === 'string' ? new Date(calendarDate) : calendarDate;
    const normalizedContextDate = normalizeDate(contextDate);
    
    if (normalizedContextDate.getTime() !== normalizedSelectedDate.getTime()) {
      setCalendarDate(normalizedSelectedDate);
    }
  }, [selectedDate, setCalendarDate, calendarDate]);

  // Effect to update todos in global state when tasks change - with optimization
  useEffect(() => {
    if (tasks.length === 0 && (!todos || todos.length === 0)) {
      return; // No need to update if both are empty
    }
    
    // Convert tasks to todos format for global state
    const updatedTodos = tasks.map(task => ({
      id: task.id,
      text: task.title,
      title: task.title,
      completed: task.completed,
      date: task.date,
      assignedTo: task.assignedTo,
      crew: task.crew,
      location: task.location,
      startTime: task.startTime,
      endTime: task.endTime,
      clientId: task.clientId,
      clientLocationId: task.clientLocationId,
      description: task.description,
      crewId: task.crewId,
      crewName: task.crewName
    }));
    
    // Compare current todos with updated todos to prevent unnecessary updates
    let hasChanges = !todos || todos.length !== updatedTodos.length;
    
    // Only do deep comparison if lengths are the same
    if (!hasChanges && todos) {
      hasChanges = !isEqual(todos, updatedTodos);
    }
    
    // Only update if there are differences
    if (hasChanges) {
      setTodos(updatedTodos);
    }
  }, [tasks, setTodos, todos]);

  // Toggle task completion
  const handleToggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.success(
        task.completed ? "Task marked as incomplete" : "Task marked as complete",
        { description: task.title }
      );
    }
  }, [tasks]);

  // Handle moving a task to a different date
  const handleMoveTask = useCallback((taskId: string, newDate: Date) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (task && !isSameDay(task.date, newDate)) {
      // Create task copy with updated date
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === taskId 
          ? { ...t, date: newDate } 
          : t
      ));
      
      toast.success(`Task "${task.title}" moved to ${newDate.toLocaleDateString()}`, {
        description: `${task.startTime} - ${task.endTime}`
      });
    }
  }, [tasks]);
  
  // Save task edit changes
  const handleSaveTaskChanges = useCallback((taskId: string, updatedData: Partial<Task>) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, ...updatedData } : task
    ));

    toast.success("Task updated successfully", { 
      description: updatedData.title || "Changes have been saved" 
    });
  }, []);
  
  // Add analyzed schedule data
  const handleApplyScheduleData = useCallback((newTaskFromFile: Task) => {
    setTasks(prevTasks => [...prevTasks, newTaskFromFile]);
    toast.success("New task added from analyzed file");
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    tasks,
    setTasks,
    handleToggleTaskCompletion,
    handleMoveTask,
    handleSaveTaskChanges,
    handleApplyScheduleData,
    employees, 
    crews, 
    clients, 
    clientLocations,
  };
};
