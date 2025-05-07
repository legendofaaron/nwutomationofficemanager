
import React, { useState, useEffect } from 'react';
import { useDragAndDrop } from './useDragAndDrop';
import DragDropProvider from './DragDropContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  List
} from 'lucide-react';
import TaskListView from './TaskListView';
import TaskCalendarView from './calendar/TaskCalendarView';
import ScheduleFilterBar from './ScheduleFilterBar';
import { generateMockScheduleData } from './MockScheduleData';
import { Employee, Crew, Task, Client, ScheduleFilter } from './ScheduleTypes';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TaskEditDialog from './taskEdit/TaskEditDialog';

interface ScheduleViewProps {
  initialTasks?: Task[];
  employees?: Employee[];
  crews?: Crew[];
  clients?: Client[];
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ 
  initialTasks, 
  employees: initialEmployees, 
  crews: initialCrews,
  clients: initialClients
}) => {
  // Initialize with mock data if not provided
  const mockData = generateMockScheduleData();
  
  const [tasks, setTasks] = useState<Task[]>(initialTasks || mockData.tasks);
  const [employees] = useState<Employee[]>(initialEmployees || mockData.employees);
  const [crews] = useState<Crew[]>(initialCrews || mockData.crews);
  const [clients] = useState<Client[]>(initialClients || mockData.clients);
  
  // View state
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filter, setFilter] = useState<ScheduleFilter>({ type: 'all' });
  
  // Task editing state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Set up drag and drop
  const { handleDragEnd } = useDragAndDrop({ tasks, setTasks });

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter.type === 'all') return true;
    
    if (filter.type === 'employee' && filter.name) {
      return task.assignedTo === filter.name || 
             (task.crew && task.crew.includes(filter.name));
    }
    
    if (filter.type === 'crew' && filter.id) {
      return task.crewId === filter.id;
    }
    
    if (filter.type === 'client' && filter.id) {
      return task.clientId === filter.id;
    }
    
    return true;
  });

  // Create a new task
  const handleCreateTask = () => {
    setIsCreateDialogOpen(true);
    setEditingTask(null);
  };

  // Open task for editing
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsCreateDialogOpen(true);
  };

  // Handle task changes (create/update)
  const handleSaveTaskChanges = (taskData: Partial<Task>, isNew: boolean) => {
    if (isNew) {
      // Create a new task
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskData.title || 'Untitled Task',
        date: taskData.date || new Date(),
        startTime: taskData.startTime || '09:00',
        endTime: taskData.endTime || '10:00',
        assignedTo: taskData.assignedTo || undefined,
        crew: taskData.crew || undefined,
        crewId: taskData.crewId || undefined,
        crewName: taskData.crewName || undefined,
        clientId: taskData.clientId || undefined,
        location: taskData.location || undefined,
        notes: taskData.notes || undefined,
        completed: false,
        status: taskData.status || 'scheduled'
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
    } else if (editingTask) {
      // Update existing task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTask.id ? { ...task, ...taskData } : task
        )
      );
    }
    
    setIsCreateDialogOpen(false);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setIsCreateDialogOpen(false);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <DragDropProvider>
      <div className="container mx-auto space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Schedule</h1>
          <Button onClick={handleCreateTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        <ScheduleFilterBar 
          employees={employees} 
          crews={crews} 
          clients={clients} 
          currentFilter={filter}
          onFilterChange={setFilter}
          tasks={filteredTasks}
        />

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'calendar' | 'list')} className="mb-4">
          <TabsList>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {viewMode === 'calendar' ? (
          <TaskCalendarView 
            tasks={filteredTasks} 
            onEditTask={handleEditTask}
          />
        ) : (
          <TaskListView 
            tasks={filteredTasks}
            onEditTask={handleEditTask}
            employees={employees}
            crews={crews}
            clients={clients}
          />
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0">
          <TaskEditDialog 
            task={editingTask}
            employees={employees}
            crews={crews}
            clients={clients}
            onSave={handleSaveTaskChanges}
            onDelete={handleDeleteTask}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </DragDropProvider>
  );
};

export default ScheduleView;
