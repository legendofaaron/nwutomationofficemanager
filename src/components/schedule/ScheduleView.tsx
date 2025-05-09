import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Users, User, Building2 } from 'lucide-react';
import { Task, Crew, Employee, Client, ClientLocation, ScheduleFilter } from './ScheduleTypes';
import TaskCalendarView from './calendar/TaskCalendarView';
import TaskListView from './TaskListView';
import TaskEditDialog from './taskEdit/TaskEditDialog';
import { generateMockTasks, generateMockEmployees, generateMockCrews, generateMockClients, generateMockClientLocations } from './MockScheduleData';
import ScheduleFilterBar from './ScheduleFilterBar';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import { useCalendarSync } from '@/hooks/useCalendarSync';

const ScheduleView: React.FC = () => {
  // State for tasks and related data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientLocations, setClientLocations] = useState<ClientLocation[]>([]);
  
  // Get global todos from AppContext
  const { todos, setTodos } = useAppContext();
  
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
      
      toast.success("Task updated in all calendars");
    }
    
    // Update the selected date to match the task's new date
    setSelectedDate(newDate);
    setCalendarDate(newDate);
  }, [todos, setTodos, setCalendarDate]);

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
      
      toast.success("Task updated in all calendars");
    }
    
    // If the date was changed, update the selected date
    if (updatedData.date) {
      setSelectedDate(updatedData.date);
      setCalendarDate(updatedData.date);
    }
  }, [todos, setTodos, setCalendarDate]);

  const handleAddNewTask = useCallback(() => {
    // Create a new task template
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      date: selectedDate,
      completed: false,
      startTime: '09:00',
      endTime: '10:00'
    };
    
    // Add to tasks and open editor
    setTasks(prevTasks => [...prevTasks, newTask]);
    setEditingTask(newTask);
    setIsEditDialogOpen(true);
    
    // Also add to global todos
    setTodos(prevTodos => [...prevTodos, {
      id: newTask.id,
      text: newTask.title,
      completed: newTask.completed,
      date: newTask.date,
      startTime: newTask.startTime,
      endTime: newTask.endTime
    }]);
  }, [selectedDate, setTodos]);

  // Handle date change (sync with global date using the enhanced hook)
  const handleDateChange = useCallback((date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  }, [setSelectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        
        <ScheduleFilterBar 
          employees={employees}
          crews={crews}
          clients={clients}
          currentFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
      
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'calendar' | 'list')} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            {activeFilter.type !== 'all' && (
              <span className="flex items-center gap-1.5">
                {activeFilter.type === 'employee' && <User className="h-3.5 w-3.5" />}
                {activeFilter.type === 'crew' && <Users className="h-3.5 w-3.5" />}
                {activeFilter.type === 'client' && <Building2 className="h-3.5 w-3.5" />}
                Filtered by {activeFilter.type}: {activeFilter.name}
              </span>
            )}
          </div>
        </div>
        
        <TabsContent value="calendar" className="m-0">
          <TaskCalendarView 
            tasks={filteredTasks}
            selectedDate={selectedDate}
            onSelectDate={handleDateChange}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            crews={crews}
            onAddNewTask={handleAddNewTask}
            onMoveTask={handleMoveTask}
            onEditTask={handleEditTask}
          />
        </TabsContent>
        
        <TabsContent value="list" className="m-0">
          <TaskListView 
            tasks={filteredTasks}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            onEditTask={handleEditTask}
            crews={crews}
            clients={clients}
            clientLocations={clientLocations}
          />
        </TabsContent>
      </Tabs>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <TaskEditDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSaveChanges={handleSaveTaskChanges}
            task={editingTask}
            crews={crews}
            employees={employees}
            clients={clients}
            clientLocations={clientLocations}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleView;
