
import { useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  date: Date;
  time?: string;
  completed: boolean;
}

export function useCalendarState() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const { setCalendarDate } = useAppContext();
  
  // Update both local and global date
  const updateSelectedDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setCalendarDate(date);
  }, [setCalendarDate]);
  
  // Add a new task
  const addTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    
    setTasks(prev => [...prev, newTask]);
    toast.success("Task added successfully");
    
    return newTask;
  }, []);
  
  // Update an existing task
  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    
    toast.success("Task updated");
  }, []);
  
  // Delete a task
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.info("Task deleted");
  }, []);
  
  // Toggle task completion
  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);
  
  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter(task => 
      task.date.toDateString() === date.toDateString()
    );
  }, [tasks]);
  
  // Get task count for a specific date
  const getTaskCountForDate = useCallback((date: Date) => {
    return getTasksForDate(date).length;
  }, [getTasksForDate]);
  
  return {
    selectedDate,
    setSelectedDate: updateSelectedDate,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTasksForDate,
    getTaskCountForDate
  };
}
