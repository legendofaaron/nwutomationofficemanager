import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { Task, TaskFormData, AssignmentType, LocationType } from './schedule/ScheduleTypes';
import TaskCalendarView from './schedule/TaskCalendarView';
import TaskListView from './schedule/TaskListView';
import UploadAnalyzeSection from './schedule/UploadAnalyzeSection';
import TeamEventDialog from './schedule/TeamEventDialog';

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

  const [teamEventDialogOpen, setTeamEventDialogOpen] = useState(false);
  const [droppedCrewId, setDroppedCrewId] = useState<string | null>(null);
  
  // State to track assignment and location types
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('individual');
  const [locationType, setLocationType] = useState<LocationType>('custom');

  // FormData state instead of newTask
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

  // Handler for adding a new task
  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  // Handler for toggling task completion status
  const handleToggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  // New handler for dragover events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // New handler for drop events
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const dragData = JSON.parse(data);
        if (dragData.type === 'crew') {
          setDroppedCrewId(dragData.id);
          setTeamEventDialogOpen(true);
          
          // Pre-fill the form with crew data
          setFormData({
            ...formData,
            title: `${dragData.name} Team Meeting`,
            assignedCrew: dragData.id,
            assignedTo: '',
            startTime: '09:00',
            endTime: '10:00',
            location: '',
            clientId: '',
            clientLocationId: ''
          });
          
          // Set assignment type to crew
          setAssignmentType('crew');
          
          toast(`Creating event for ${dragData.name} crew`, {
            description: "Fill in the details to schedule this team event"
          });
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  // Handle creating team event from dropped crew
  const handleCreateTeamEvent = () => {
    if (!formData.title || !formData.assignedCrew) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Find the crew to get members
    const selectedCrew = crews.find(crew => crew.id === formData.assignedCrew);
    let crewMembers: string[] = [];
    
    if (selectedCrew) {
      crewMembers = selectedCrew.members.map(memberId => {
        const employee = employees.find(emp => emp.id === memberId);
        return employee ? employee.name : '';
      }).filter(name => name !== '');
    }
    
    const teamEvent: Task = {
      id: Date.now().toString(),
      title: formData.title,
      date: selectedDate,
      completed: false,
      crew: crewMembers,
      crewId: formData.assignedCrew,
      startTime: formData.startTime,
      endTime: formData.endTime
    };
    
    // Handle location based on selected type
    if (locationType === 'custom' && formData.location) {
      teamEvent.location = formData.location;
    } else if (locationType === 'client' && formData.clientId && formData.clientLocationId) {
      const client = clients.find(c => c.id === formData.clientId);
      const location = clientLocations.find(l => l.id === formData.clientLocationId);
      
      if (client && location) {
        teamEvent.location = `${client.name} - ${location.name}`;
        teamEvent.clientId = formData.clientId;
        teamEvent.clientLocationId = formData.clientLocationId;
      }
    }
    
    setTasks([...tasks, teamEvent]);
    setTeamEventDialogOpen(false);
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
    setDroppedCrewId(null);
    
    toast.success("Team event scheduled successfully");
  };

  return (
    <div 
      className="p-4" 
      onDragOver={handleDragOver} 
      onDrop={handleDrop}
    >
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-4">
          <TaskCalendarView 
            selectedDate={selectedDate}
            onSelectDate={(date) => date && setSelectedDate(date)}
            tasks={tasks}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            crews={crews}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <TaskListView 
            tasks={tasks}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            crews={crews}
            clients={clients}
            clientLocations={clientLocations}
          />
        </TabsContent>
      </Tabs>

      {/* Upload and Analyze Section at the bottom */}
      <UploadAnalyzeSection 
        selectedDate={selectedDate}
        onApplyScheduleData={handleAddTask}
      />

      {/* Team Event Dialog */}
      <TeamEventDialog 
        open={teamEventDialogOpen}
        onOpenChange={setTeamEventDialogOpen}
        formData={formData}
        setFormData={setFormData}
        selectedDate={selectedDate}
        assignmentType={assignmentType}
        setAssignmentType={setAssignmentType}
        locationType={locationType}
        setLocationType={setLocationType}
        onCreateEvent={handleCreateTeamEvent}
        employees={employees}
        crews={crews}
        clients={clients}
        clientLocations={clientLocations}
      />
    </div>
  );
};

export default ScheduleView;
