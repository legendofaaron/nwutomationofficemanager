
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Task } from '../ScheduleTypes';
import { normalizeDate, isSameDay } from '@/components/calendar/CalendarUtils';
import { toast } from 'sonner';

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
  
  // Effect to convert todos from AppContext to tasks when component mounts or todos change
  useEffect(() => {
    if (todos && todos.length > 0) {
      const convertedTasks = todos.map(todo => ({
        id: todo.id,
        title: todo.text || todo.title || '',
        date: todo.date instanceof Date ? todo.date : new Date(todo.date),
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
        crewName: todo.crewName
      }));
      
      setTasks(convertedTasks);
    } else {
      setTasks([]);
    }
  }, [todos]);
  
  // Effect to synchronize selected date with App context - prevent unnecessary updates
  useEffect(() => {
    if (calendarDate) {
      const contextDateObj = typeof calendarDate === 'string' ? new Date(calendarDate) : calendarDate;
      const normalizedContextDate = normalizeDate(contextDateObj);
      const normalizedSelectedDate = normalizeDate(selectedDate);
      
      // Only update if dates are truly different to prevent infinite loops
      if (normalizedSelectedDate.getTime() !== normalizedContextDate.getTime()) {
        setSelectedDate(normalizedContextDate);
      }
    }
  }, [calendarDate]);

  // Effect to update global state when local selected date changes - prevent unnecessary updates
  useEffect(() => {
    const normalizedSelectedDate = normalizeDate(selectedDate);
    
    // Only update the context if necessary
    if (!calendarDate || 
        (typeof calendarDate === 'string' && normalizeDate(new Date(calendarDate)).getTime() !== normalizedSelectedDate.getTime()) ||
        (calendarDate instanceof Date && normalizeDate(calendarDate).getTime() !== normalizedSelectedDate.getTime())) {
      setCalendarDate(normalizedSelectedDate);
    }
  }, [selectedDate, setCalendarDate, calendarDate]);

  // Effect to update todos in global state when tasks change
  useEffect(() => {
    // Only update todos if tasks have changed (prevent infinite loop)
    if (tasks.length > 0) {
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
      const currentIdsMap = new Map(todos.map(todo => [todo.id, JSON.stringify(todo)]));
      const updatedIdsMap = new Map(updatedTodos.map(todo => [todo.id, JSON.stringify(todo)]));
      
      // Check if there are actual differences before updating
      let hasChanges = currentIdsMap.size !== updatedIdsMap.size;
      
      if (!hasChanges) {
        // Check if any specific todo has changed
        for (const [id, todoJson] of currentIdsMap.entries()) {
          if (!updatedIdsMap.has(id) || updatedIdsMap.get(id) !== todoJson) {
            hasChanges = true;
            break;
          }
        }
      }
      
      // Only update if there are differences
      if (hasChanges) {
        setTodos(updatedTodos);
      }
    } else if (todos.length > 0 && tasks.length === 0) {
      // If we have todos but no tasks, clear the todos
      setTodos([]);
    }
  }, [tasks, setTodos, todos]);

  // Toggle task completion
  const handleToggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.success(
        task.completed ? "Task marked as incomplete" : "Task marked as complete",
        { description: task.title }
      );
    }
  };

  // Handle moving a task to a different date
  const handleMoveTask = (taskId: string, newDate: Date) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (task && !isSameDay(task.date, newDate)) {
      // Create task copy with updated date
      setTasks(tasks.map(t => 
        t.id === taskId 
          ? { ...t, date: newDate } 
          : t
      ));
      
      toast.success(`Task "${task.title}" moved to ${newDate.toLocaleDateString()}`, {
        description: `${task.startTime} - ${task.endTime}`
      });
    }
  };
  
  // Save task edit changes
  const handleSaveTaskChanges = (taskId: string, updatedData: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedData } : task
    ));

    toast.success("Task updated successfully", { 
      description: updatedData.title || "Changes have been saved" 
    });
  };
  
  // Add analyzed schedule data
  const handleApplyScheduleData = (newTaskFromFile: Task) => {
    setTasks([...tasks, newTaskFromFile]);
    toast.success("New task added from analyzed file");
  };

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
