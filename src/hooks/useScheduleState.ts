
import { useState, useEffect, useCallback } from 'react';
import { Task, Crew, Employee, Client, ClientLocation, ScheduleFilter } from '@/components/schedule/ScheduleTypes';
import { generateMockTasks, generateMockEmployees, generateMockCrews, generateMockClients, generateMockClientLocations } from '@/components/schedule/MockScheduleData';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';
import { useCalendarSync } from '@/hooks/useCalendarSync';

export const useScheduleState = () => {
  // State for tasks and related data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientLocations, setClientLocations] = useState<ClientLocation[]>([]);
  
  // Get global todos from AppContext
  const { todos, setTodos, setCalendarDate } = useAppContext();
  
  // Use the enhanced calendar sync hook
  const { date: selectedDate, setDate: setSelectedDate } = useCalendarSync();
  
  // UI state
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ScheduleFilter>({ type: 'all' });

  // Load mock data and synchronize with global todos
  useEffect(() => {
    const mockEmployees = generateMockEmployees();
    const mockCrews = generateMockCrews(mockEmployees);
    const mockClients = generateMockClients();
    const mockClientLocations = generateMockClientLocations(mockClients);
    
    // Convert global todos to tasks
    const todoTasks: Task[] = todos.map(todo => ({
      id: todo.id,
      title: todo.text,
      description: '',
      date: todo.date,
      completed: todo.completed,
      assignedTo: todo.assignedTo,
      crew: todo.crewMembers,
      crewId: todo.crewId,
      crewName: todo.crewName,
      startTime: todo.startTime,
      endTime: todo.endTime,
      location: todo.location
    }));
    
    // Generate some additional mock tasks
    const mockTasks = generateMockTasks(mockEmployees, mockCrews, mockClients, mockClientLocations);
    
    // Combine todo tasks and mock tasks, avoiding duplicates
    const combinedTasks = [...todoTasks];
    mockTasks.forEach(mockTask => {
      const exists = combinedTasks.some(task => task.id === mockTask.id);
      if (!exists) {
        combinedTasks.push(mockTask);
      }
    });
    
    setEmployees(mockEmployees);
    setCrews(mockCrews);
    setClients(mockClients);
    setClientLocations(mockClientLocations);
    setTasks(combinedTasks);
  }, [todos]);

  // Filter tasks based on active filter
  const filteredTasks = tasks.filter(task => {
    if (activeFilter.type === 'all') return true;
    if (activeFilter.type === 'employee' && activeFilter.id) {
      return task.assignedTo === activeFilter.id;
    }
    if (activeFilter.type === 'crew' && activeFilter.id) {
      return task.crewId === activeFilter.id;
    }
    if (activeFilter.type === 'client' && activeFilter.id) {
      return task.clientId === activeFilter.id;
    }
    return true;
  });

  // Task actions
  const handleToggleTaskCompletion = useCallback((taskId: string) => {
    // Update local tasks
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
    
    // Update global todos if the task exists there
    const todoExists = todos.some(todo => todo.id === taskId);
    if (todoExists) {
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === taskId 
            ? { ...todo, completed: !todo.completed } 
            : todo
        )
      );
    }
  }, [todos, setTodos]);

  const handleMoveTask = useCallback((taskId: string, newDate: Date) => {
    // Update local tasks
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, date: newDate } 
          : task
      )
    );
    
    // Update global todos if the task exists there
    const todoExists = todos.some(todo => todo.id === taskId);
    if (todoExists) {
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === taskId 
            ? { ...todo, date: newDate } 
            : todo
        )
      );
      
      toast({
        title: "Task updated",
        description: "Task updated in all calendars",
        variant: "success"
      });
    }
    
    // Update the selected date to match the task's new date
    setSelectedDate(newDate);
    setCalendarDate(newDate);
  }, [todos, setTodos, setSelectedDate, setCalendarDate]);

  const handleEditTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsEditDialogOpen(true);
    }
  }, [tasks]);

  const handleSaveTaskChanges = useCallback((taskId: string, updatedData: Partial<Task>) => {
    // Update local tasks
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updatedData } 
          : task
      )
    );
    
    // Update global todos if the task exists there
    const todoExists = todos.some(todo => todo.id === taskId);
    if (todoExists) {
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === taskId 
            ? { 
                ...todo, 
                text: updatedData.title || todo.text,
                completed: updatedData.completed ?? todo.completed,
                date: updatedData.date || todo.date,
                assignedTo: updatedData.assignedTo,
                startTime: updatedData.startTime,
                endTime: updatedData.endTime,
                location: updatedData.location,
                crewId: updatedData.crewId,
                crewName: updatedData.crewName
              } 
            : todo
        )
      );
      
      toast({
        title: "Task updated",
        description: "Task updated in all calendars",
        variant: "success"
      });
    }
    
    // If the date was changed, update the selected date
    if (updatedData.date) {
      setSelectedDate(updatedData.date);
      setCalendarDate(updatedData.date);
    }
  }, [todos, setTodos, setSelectedDate, setCalendarDate]);

  // Added support for creating a task with preset data
  const handleAddNewTask = useCallback((taskData?: Partial<Task>) => {
    // Create a new task template
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData?.title || 'New Task',
      date: taskData?.date || selectedDate,
      completed: taskData?.completed || false,
      startTime: taskData?.startTime || '09:00',
      endTime: taskData?.endTime || '10:00',
      assignedTo: taskData?.assignedTo,
      crewId: taskData?.crewId,
      crewName: taskData?.crewName,
      location: taskData?.location
    };
    
    // Add to tasks
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    if (!taskData) {
      // Only open editor if we don't have preset data
      setEditingTask(newTask);
      setIsEditDialogOpen(true);
    }
    
    // Also add to global todos
    setTodos(prevTodos => [...prevTodos, {
      id: newTask.id,
      text: newTask.title,
      completed: newTask.completed,
      date: newTask.date,
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      assignedTo: newTask.assignedTo,
      crewId: newTask.crewId,
      crewName: newTask.crewName,
      location: newTask.location
    }]);
    
    return newTask;
  }, [selectedDate, setTodos]);

  // Handle date change (sync with global date using the enhanced hook)
  const handleDateChange = useCallback((date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  }, [setSelectedDate]);

  return {
    viewMode,
    setViewMode,
    filteredTasks,
    selectedDate,
    editingTask,
    isEditDialogOpen,
    setIsEditDialogOpen,
    activeFilter,
    setActiveFilter,
    crews,
    employees,
    clients,
    clientLocations,
    handleToggleTaskCompletion,
    handleMoveTask,
    handleEditTask,
    handleSaveTaskChanges,
    handleAddNewTask,
    handleDateChange
  };
};
