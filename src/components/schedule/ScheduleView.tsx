
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, CalendarIcon, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { Task, TaskFormData, AssignmentType, LocationType } from './ScheduleTypes';

// Import components
import TaskCalendarView from './TaskCalendarView';
import TaskListView from './TaskListView';
import TeamEventDialog from './TeamEventDialog';
import UploadAnalyzeSection from './UploadAnalyzeSection';
import { parseClientLocationValue } from './ScheduleHelpers';

const ScheduleView = () => {
  const { employees, crews, clients, clientLocations, calendarDate } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(calendarDate || new Date());
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

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [teamEventDialogOpen, setTeamEventDialogOpen] = useState(false);
  const [droppedCrewId, setDroppedCrewId] = useState<string | null>(null);
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('individual');
  const [locationType, setLocationType] = useState<LocationType>('custom');
  
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

  // Handle applying analyzed schedule data
  const handleApplyScheduleData = (newTaskFromFile: Task) => {
    setTasks([...tasks, newTaskFromFile]);
    toast.success("New task added from analyzed file");
  };

  // New handler for dragover events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Visual feedback for drag over
    if (e.currentTarget.classList.contains('schedule-drop-zone')) {
      e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900/10', 'border-blue-200', 'dark:border-blue-800');
    }
  };
  
  // Handler for drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual feedback
    if (e.currentTarget.classList.contains('schedule-drop-zone')) {
      e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/10', 'border-blue-200', 'dark:border-blue-800');
    }
  };

  // New handler for drop events
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual feedback
    if (e.currentTarget.classList.contains('schedule-drop-zone')) {
      e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/10', 'border-blue-200', 'dark:border-blue-800');
    }
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const dragData = JSON.parse(data);
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
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error("Error processing the dragged item");
    }
  };

  return (
    <div 
      className="p-4 schedule-drop-zone transition-colors duration-300" 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 h-9 font-medium">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
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
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <TaskListView
            tasks={tasks}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            crews={crews}
            clients={clients}
            clientLocations={clientLocations}
          />
        </TabsContent>
      </Tabs>

      {/* Upload and Analyze Section */}
      <UploadAnalyzeSection 
        onApplyScheduleData={handleApplyScheduleData}
        selectedDate={selectedDate}
      />

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
    </div>
  );
};

export default ScheduleView;
