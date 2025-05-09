import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Users, User, Building2 } from 'lucide-react';
import { Task, Crew, Employee, Client, ClientLocation, ScheduleFilter } from './ScheduleTypes';
import TaskCalendarView from './calendar/TaskCalendarView';
import TaskListView from './TaskListView';
import TaskEditDialog from './taskEdit/TaskEditDialog';
import { generateMockTasks, generateMockEmployees, generateMockCrews, generateMockClients, generateMockClientLocations } from './MockScheduleData';
import ScheduleFilterBar from './ScheduleFilterBar';

const ScheduleView: React.FC = () => {
  // State for tasks and related data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientLocations, setClientLocations] = useState<ClientLocation[]>([]);
  
  // UI state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ScheduleFilter>({ type: 'all' });

  // Load mock data
  useEffect(() => {
    const mockEmployees = generateMockEmployees();
    const mockCrews = generateMockCrews(mockEmployees);
    const mockClients = generateMockClients();
    const mockClientLocations = generateMockClientLocations(mockClients);
    const mockTasks = generateMockTasks(mockEmployees, mockCrews, mockClients, mockClientLocations);
    
    setEmployees(mockEmployees);
    setCrews(mockCrews);
    setClients(mockClients);
    setClientLocations(mockClientLocations);
    setTasks(mockTasks);
  }, []);

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
  const handleToggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };

  const handleMoveTask = (taskId: string, newDate: Date) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, date: newDate } 
          : task
      )
    );
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveTaskChanges = (taskId: string, updatedData: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updatedData } 
          : task
      )
    );
  };

  const handleAddNewTask = () => {
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
  };

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
            onSelectDate={(date) => date && setSelectedDate(date)}
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
