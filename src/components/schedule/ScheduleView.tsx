import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, CalendarIcon, List, FileUp, Pencil, Users, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { Task, TaskFormData, AssignmentType, LocationType } from './ScheduleTypes';

// Import components
import TaskCalendarView from './TaskCalendarView';
import TaskListView from './TaskListView';
import TeamEventDialog from './TeamEventDialog';
import TaskEditDialog from './TaskEditDialog';
import UploadAnalyzeSection from './UploadAnalyzeSection';

const ScheduleView = () => {
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
  
  const [selectedDate, setSelectedDate] = useState<Date>(calendarDate || new Date());
  
  // Synchronize tasks with todos from AppContext
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      completed: false,
      assignedTo: 'John Smith',
      startTime: '09:00',
      endTime: '10:00',
      location: 'Conference Room'
    },
    {
      id: '2',
      title: 'Project Review',
      date: new Date(),
      completed: true,
      assignedTo: 'Sarah Johnson',
      startTime: '14:00',
      endTime: '15:00',
      location: 'Office'
    },
    {
      id: '3',
      title: 'Site Inspection',
      date: new Date(),
      completed: false,
      crew: ['John Smith', 'Michael Brown'],
      startTime: '13:00',
      endTime: '16:00',
      location: 'Client Site',
      clientId: '1',
      clientLocationId: '1'
    },
  ]);
  
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Effect to synchronize selected date with App context
  useEffect(() => {
    if (calendarDate && calendarDate.getTime() !== selectedDate.getTime()) {
      setSelectedDate(calendarDate);
    }
  }, [calendarDate]);

  // Effect to update global state when local selected date changes
  useEffect(() => {
    setCalendarDate(selectedDate);
  }, [selectedDate, setCalendarDate]);

  // Effect to keep todos and tasks synchronized
  useEffect(() => {
    // Convert tasks to todos format for global state
    const updatedTodos = tasks.map(task => ({
      id: task.id,
      text: task.title,
      completed: task.completed,
      date: task.date,
      assignedTo: task.assignedTo,
      crew: task.crew,
      location: task.location,
      startTime: task.startTime,
      endTime: task.endTime
    }));
    
    setTodos(updatedTodos);
  }, [tasks, setTodos]);

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [teamEventDialogOpen, setTeamEventDialogOpen] = useState(false);
  const [droppedCrewId, setDroppedCrewId] = useState<string | null>(null);
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('individual');
  const [locationType, setLocationType] = useState<LocationType>('custom');
  
  // Add state for crew assignment mode
  const [showCrewPanel, setShowCrewPanel] = useState(false);
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    assignedTo: '',
    assignedCrew: '',
    startTime: '',
    endTime: '',
    location: '',
    clientId: '',
    clientLocationId: ''
  });

  const handleAddTask = () => {
    if (formData.title && formData.startTime && formData.endTime) {
      const task: Task = {
        id: Date.now().toString(),
        title: formData.title,
        date: selectedDate,
        completed: false,
        startTime: formData.startTime,
        endTime: formData.endTime
      };
      
      // Handle assignment based on selected type
      if (assignmentType === 'individual' && formData.assignedTo) {
        task.assignedTo = formData.assignedTo;
      } else if (assignmentType === 'crew' && formData.assignedCrew) {
        // Get crew members' names
        const selectedCrew = crews.find(crew => crew.id === formData.assignedCrew);
        if (selectedCrew) {
          task.crew = selectedCrew.members.map(memberId => {
            const employee = employees.find(emp => emp.id === memberId);
            return employee ? employee.name : '';
          }).filter(name => name !== '');
          task.crewId = formData.assignedCrew;
        }
      }
      
      // Handle location based on selected type
      if (locationType === 'custom' && formData.location) {
        task.location = formData.location;
      } else if (locationType === 'client' && formData.clientId && formData.clientLocationId) {
        const client = clients.find(c => c.id === formData.clientId);
        const location = clientLocations.find(l => l.id === formData.clientLocationId);
        
        if (client && location) {
          task.location = `${client.name} - ${location.name}`;
          task.clientId = formData.clientId;
          task.clientLocationId = formData.clientLocationId;
        }
      }
      
      setTasks([...tasks, task]);
      resetFormData();
      setIsTaskDialogOpen(false);
      toast.success("Task scheduled successfully");
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const resetFormData = () => {
    setFormData({ 
      title: '', 
      assignedTo: '', 
      assignedCrew: '', 
      startTime: '', 
      endTime: '', 
      location: '',
      clientId: '',
      clientLocationId: ''
    });
  };

  // Handle creating team event from dropped crew
  const handleCreateTeamEvent = () => {
    handleAddTask();
    setTeamEventDialogOpen(false);
    setDroppedCrewId(null);
  };

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

  // Handle opening task dialog with pre-filled date
  const handleOpenAddTaskDialog = (type: 'individual' | 'crew' = 'individual') => {
    // Reset form data
    resetFormData();
    
    // Pre-fill with default times
    setFormData({
      ...formData,
      startTime: '09:00',
      endTime: '10:00'
    });
    
    // Set assignment type based on button clicked
    setAssignmentType(type);
    
    // Open the dialog
    setIsTaskDialogOpen(true);
  };

  // Helper to open crew visit task dialog
  const handleOpenCrewVisitDialog = () => {
    resetFormData();
    
    setFormData({
      ...formData,
      title: 'Client Site Visit',
      startTime: '09:00',
      endTime: '16:00'
    });
    
    setAssignmentType('crew');
    setLocationType('client');
    setIsTaskDialogOpen(true);
  };

  // Handle editing a task
  const handleEditTask = (taskId: string) => {
    const taskToEdit = tasks.find(t => t.id === taskId);
    if (taskToEdit) {
      setCurrentEditTask(taskToEdit);
      setIsEditDialogOpen(true);
    }
  };

  // Handle saving task edit changes
  const handleSaveTaskChanges = (taskId: string, updatedData: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedData } : task
    ));

    toast.success("Task updated successfully", { 
      description: updatedData.title || "Changes have been saved" 
    });
  };

  // Handle applying analyzed schedule data
  const handleApplyScheduleData = (newTaskFromFile: Task) => {
    setTasks([...tasks, newTaskFromFile]);
    toast.success("New task added from analyzed file");
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add classes for drop zone visual feedback
    if (e.currentTarget.classList.contains('schedule-drop-zone')) {
      e.currentTarget.classList.add('drag-over');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual feedback classes
    if (e.currentTarget.classList.contains('schedule-drop-zone')) {
      e.currentTarget.classList.remove('drag-over');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual feedback
    if (e.currentTarget.classList.contains('schedule-drop-zone')) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const dragData = JSON.parse(data);
        
        // Handle crew drop
        if (dragData.type === 'crew') {
          setDroppedCrewId(dragData.id);
          
          // Pre-fill the form with crew data
          setFormData({
            ...formData,
            title: `${dragData.name} Team Meeting`,
            assignedCrew: dragData.id,
            assignedTo: '',
            startTime: '09:00',
            endTime: '10:00'
          });
          
          // Set assignment type to crew
          setAssignmentType('crew');
          setTeamEventDialogOpen(true);
          
          toast.success(`Creating event for ${dragData.name} crew`, {
            description: "Fill in the details to schedule this team event"
          });
        }
        
        // Handle task drop for reordering or moving to a different day
        else if (dragData.type === 'task') {
          const taskId = dragData.id;
          const task = tasks.find(t => t.id === taskId);
          
          if (task && task.date.toDateString() !== selectedDate.toDateString()) {
            // Update the task date
            setTasks(tasks.map(t => 
              t.id === taskId 
                ? { ...t, date: selectedDate } 
                : t
            ));
            
            toast.success(`Task moved to ${selectedDate.toLocaleDateString()}`, {
              description: task.title
            });
          }
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error("Error processing the dragged item");
    }
  };

  // Handle moving a task to a different date
  const handleMoveTask = (taskId: string, newDate: Date) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.date.toDateString() !== newDate.toDateString()) {
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

  return (
    <div 
      className="p-4 schedule-drop-zone transition-colors duration-300 rounded-lg" 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="gap-2 h-9 font-medium"
            onClick={() => handleOpenAddTaskDialog('individual')}
          >
            <User className="h-4 w-4" />
            Employee Task
          </Button>
          
          <Button 
            size="sm" 
            className="gap-2 h-9 font-medium"
            onClick={() => handleOpenAddTaskDialog('crew')}
          >
            <Users className="h-4 w-4" />
            Crew Task
          </Button>
          
          <Button 
            size="sm" 
            variant="secondary" 
            className="gap-2 h-9 font-medium"
            onClick={handleOpenCrewVisitDialog}
          >
            <MapPin className="h-4 w-4" />
            Client Visit
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-0">
          <TaskCalendarView
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={(date) => date && setSelectedDate(date)}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            crews={crews}
            onAddNewTask={handleOpenAddTaskDialog}
            onMoveTask={handleMoveTask}
            onEditTask={handleEditTask}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <TaskListView
            tasks={tasks}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            crews={crews}
            clients={clients}
            clientLocations={clientLocations}
            onEditTask={handleEditTask}
          />
        </TabsContent>
      </Tabs>

      {/* Upload and Analyze Section */}
      <div className="mt-8 border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
            <FileUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold">Upload & Analyze Schedule</h2>
        </div>
        
        <UploadAnalyzeSection 
          onApplyScheduleData={handleApplyScheduleData}
          selectedDate={selectedDate}
        />
      </div>

      {/* Guide Panel */}
      <div className="mt-6 border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
        <h3 className="font-medium text-lg mb-2 text-blue-700 dark:text-blue-400">Scheduling Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col gap-2">
            <div className="font-medium text-blue-800 dark:text-blue-300">Individual Tasks</div>
            <p className="text-blue-700 dark:text-blue-400">Assign tasks to specific employees with the "Employee Task" button.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-medium text-blue-800 dark:text-blue-300">Crew Tasks</div>
            <p className="text-blue-700 dark:text-blue-400">Schedule tasks for entire crews with the "Crew Task" button.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-medium text-blue-800 dark:text-blue-300">Client Visits</div>
            <p className="text-blue-700 dark:text-blue-400">Use "Client Visit" to send a crew to a client's location.</p>
          </div>
        </div>
      </div>

      {/* Team Event Dialog for dropped crews */}
      <TeamEventDialog 
        open={teamEventDialogOpen}
        onOpenChange={setTeamEventDialogOpen}
        onCreateEvent={handleCreateTeamEvent}
        formData={formData}
        setFormData={setFormData}
        assignmentType={assignmentType}
        setAssignmentType={setAssignmentType}
        locationType={locationType}
        setLocationType={setLocationType}
        selectedDate={selectedDate}
        crews={crews}
        employees={employees}
        clients={clients}
        clientLocations={clientLocations}
      />

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {assignmentType === 'individual' 
                ? 'Schedule Employee Task' 
                : locationType === 'client' 
                  ? 'Schedule Crew Client Visit' 
                  : 'Schedule Crew Task'}
            </DialogTitle>
          </DialogHeader>
          <TeamEventDialog 
            open={isTaskDialogOpen}
            onOpenChange={setIsTaskDialogOpen}
            onCreateEvent={handleAddTask}
            formData={formData}
            setFormData={setFormData}
            assignmentType={assignmentType}
            setAssignmentType={setAssignmentType}
            locationType={locationType}
            setLocationType={setLocationType}
            selectedDate={selectedDate}
            crews={crews}
            employees={employees}
            clients={clients}
            clientLocations={clientLocations}
          />
        </DialogContent>
      </Dialog>

      {/* Task Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskEditDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSaveChanges={handleSaveTaskChanges}
            task={currentEditTask}
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
