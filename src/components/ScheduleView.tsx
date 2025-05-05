import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Calendar, getCrewLetterCode } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { Plus, Upload, Loader2, CheckCircle, Users, User, Calendar as CalendarIcon, MapPin, Building2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  assignedTo?: string;
  crew?: string[];
  crewId?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  clientId?: string;
  clientLocationId?: string;
}

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

  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: '',
    assignedCrew: '',
    startTime: '',
    endTime: '',
    location: '',
    clientId: '',
    clientLocationId: ''
  });

  // Add new states for upload and analyze functionality
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedScheduleData, setAnalyzedScheduleData] = useState<Partial<Task> | null>(null);
  const [assignmentType, setAssignmentType] = useState<'individual' | 'crew'>('individual');
  
  // New state for team event dialog
  const [teamEventDialogOpen, setTeamEventDialogOpen] = useState(false);
  const [droppedCrewId, setDroppedCrewId] = useState<string | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  // New state to track location type for the task
  const [locationType, setLocationType] = useState<'custom' | 'client'>('custom');

  const handleAddTask = () => {
    if (newTask.title && newTask.startTime && newTask.endTime) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        date: selectedDate,
        completed: false,
        startTime: newTask.startTime,
        endTime: newTask.endTime
      };
      
      // Handle assignment based on selected type
      if (assignmentType === 'individual' && newTask.assignedTo) {
        task.assignedTo = newTask.assignedTo;
      } else if (assignmentType === 'crew' && newTask.assignedCrew) {
        // Get crew members' names
        const selectedCrew = crews.find(crew => crew.id === newTask.assignedCrew);
        if (selectedCrew) {
          task.crew = selectedCrew.members.map(memberId => {
            const employee = employees.find(emp => emp.id === memberId);
            return employee ? employee.name : '';
          }).filter(name => name !== '');
          task.crewId = newTask.assignedCrew;
        }
      }
      
      // Handle location based on selected type
      if (locationType === 'custom' && newTask.location) {
        task.location = newTask.location;
      } else if (locationType === 'client' && newTask.clientId && newTask.clientLocationId) {
        const client = clients.find(c => c.id === clientId);
        const location = clientLocations.find(l => l.id === newTask.clientLocationId);
        
        if (client && location) {
          task.location = `${client.name} - ${location.name}`;
          task.clientId = newTask.clientId;
          task.clientLocationId = newTask.clientLocationId;
        }
      }
      
      setTasks([...tasks, task]);
      setNewTask({ 
        title: '', 
        assignedTo: '', 
        assignedCrew: '', 
        startTime: '', 
        endTime: '', 
        location: '',
        clientId: '',
        clientLocationId: ''
      });
      toast.success("Task scheduled successfully");
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  // Add new handlers for file upload and analysis
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalyzedScheduleData(null);
    }
  };

  const handleAnalyzeFile = () => {
    if (!selectedFile) {
      toast("Please select a file to analyze");
      return;
    }

    setIsAnalyzing(true);

    // Simulate file analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedScheduleData({
        title: "Quarterly Planning Session",
        assignedTo: "Michael Brown",
        startTime: "13:00",
        endTime: "15:30"
      });
      
      toast("Schedule data extracted successfully");
    }, 1500);
  };

  const handleApplyScheduleData = () => {
    if (!analyzedScheduleData) return;
    
    const newTaskFromFile: Task = {
      id: Date.now().toString(),
      title: analyzedScheduleData.title || 'Untitled Task',
      date: selectedDate,
      completed: false,
      assignedTo: analyzedScheduleData.assignedTo,
      startTime: analyzedScheduleData.startTime,
      endTime: analyzedScheduleData.endTime
    };
    
    setTasks([...tasks, newTaskFromFile]);
    setSelectedFile(null);
    setAnalyzedScheduleData(null);
    
    toast("New task added from analyzed file");
  };

  // Helper to get employee options for select
  const getEmployeeOptions = () => {
    return employees.map(employee => (
      <SelectItem key={employee.id} value={employee.name}>
        {employee.name}
      </SelectItem>
    ));
  };

  // Helper to get crew options for select
  const getCrewOptions = () => {
    return crews.map(crew => (
      <SelectItem key={crew.id} value={crew.id}>
        {crew.name} ({crew.members.length} members)
      </SelectItem>
    ));
  };
  
  // Updated to combine client and location info in one dropdown
  const getClientLocationOptions = () => {
    const options: JSX.Element[] = [];
    
    clients.forEach(client => {
      const clientLocationsFiltered = clientLocations.filter(
        location => location.clientId === client.id
      );
      
      if (clientLocationsFiltered.length > 0) {
        // Add a label for this client (changed from SelectItem to SelectLabel to avoid value issues)
        options.push(
          <SelectLabel 
            key={`client-${client.id}`}
            className="font-medium"
          >
            {client.name}
          </SelectLabel>
        );
        
        // Add each location under this client
        clientLocationsFiltered.forEach(location => {
          const value = `${client.id}:${location.id}`;
          const displayText = `${location.name}${location.isPrimary ? " (Primary)" : ""}`;
          const description = `${location.address}${location.city ? `, ${location.city}` : ''}${location.state ? `, ${location.state}` : ''} ${location.zipCode || ''}`;
          
          options.push(
            <SelectItem 
              key={value} 
              value={value}
              description={description}
              className="pl-6"
            >
              {displayText}
            </SelectItem>
          );
        });
      }
    });
    
    return options;
  };

  // Helper to parse the combined client:location value
  const parseClientLocationValue = (value: string): { clientId: string, locationId: string } | null => {
    if (!value || !value.includes(':')) return null;
    
    const [clientId, locationId] = value.split(':');
    return { clientId, locationId };
  };

  // Helper to get crew member names for display
  const getCrewMemberNames = (crewId: string) => {
    const crew = crews.find(c => c.id === crewId);
    if (!crew) return "No members";
    
    const memberNames = crew.members.map(memberId => {
      const employee = employees.find(emp => emp.id === memberId);
      return employee ? employee.name : "";
    }).filter(Boolean);
    
    return memberNames.join(", ");
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
          setNewTask({
            ...newTask,
            title: `${dragData.name} Team Meeting`,
            assignedCrew: dragData.id,
            assignedTo: '',
            startTime: '09:00',
            endTime: '10:00'
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
    if (!newTask.title || !newTask.assignedCrew) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Find the crew to get members
    const selectedCrew = crews.find(crew => crew.id === newTask.assignedCrew);
    let crewMembers: string[] = [];
    
    if (selectedCrew) {
      crewMembers = selectedCrew.members.map(memberId => {
        const employee = employees.find(emp => emp.id === memberId);
        return employee ? employee.name : '';
      }).filter(name => name !== '');
    }
    
    const teamEvent: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      date: selectedDate,
      completed: false,
      crew: crewMembers,
      crewId: newTask.assignedCrew,
      startTime: newTask.startTime,
      endTime: newTask.endTime
    };
    
    // Handle location based on selected type
    if (locationType === 'custom' && newTask.location) {
      teamEvent.location = newTask.location;
    } else if (locationType === 'client' && newTask.clientId && newTask.clientLocationId) {
      const client = clients.find(c => c.id === clientId);
      const location = clientLocations.find(l => l.id === newTask.clientLocationId);
      
      if (client && location) {
        teamEvent.location = `${client.name} - ${location.name}`;
        teamEvent.clientId = newTask.clientId;
        teamEvent.clientLocationId = newTask.clientLocationId;
      }
    }
    
    setTasks([...tasks, teamEvent]);
    setTeamEventDialogOpen(false);
    setNewTask({ 
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

  // Helper function to get crew letter code
  const getCrewDisplayCode = (crewId: string): string => {
    const crewIndex = crews.findIndex(crew => crew.id === crewId);
    return crewIndex >= 0 ? getCrewLetterCode(crewIndex) : '';
  };
  
  // Helper to get client location info
  const getClientLocationInfo = (clientId?: string, locationId?: string) => {
    if (!clientId || !locationId) return null;
    
    const client = clients.find(c => c.id === clientId);
    const location = clientLocations.find(l => l.id === locationId);
    
    if (!client || !location) return null;
    
    return {
      clientName: client.name,
      locationName: location.name,
      address: location.address,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode
    };
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
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Schedule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Assignment Type</Label>
                        <div className="flex space-x-4">
                          <Button 
                            variant={assignmentType === 'individual' ? 'default' : 'outline'} 
                            onClick={() => setAssignmentType('individual')}
                            className="flex items-center"
                            type="button"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Individual
                          </Button>
                          <Button 
                            variant={assignmentType === 'crew' ? 'default' : 'outline'} 
                            onClick={() => setAssignmentType('crew')}
                            className="flex items-center"
                            type="button"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Crew
                          </Button>
                        </div>
                      </div>
                      
                      {assignmentType === 'individual' ? (
                        <div className="space-y-2">
                          <Label htmlFor="employee">Assign To</Label>
                          <Select
                            value={newTask.assignedTo}
                            onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                              {getEmployeeOptions()}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="crew">Assign To Crew</Label>
                          <Select
                            value={newTask.assignedCrew}
                            onValueChange={(value) => setNewTask({ ...newTask, assignedCrew: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select crew" />
                            </SelectTrigger>
                            <SelectContent>
                              {getCrewOptions()}
                            </SelectContent>
                          </Select>
                          
                          {newTask.assignedCrew && (
                            <div className="mt-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                              <strong>Crew members:</strong> {getCrewMemberNames(newTask.assignedCrew)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={newTask.startTime}
                            onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={newTask.endTime}
                            onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      {/* New location selection UI */}
                      <div className="space-y-2">
                        <Label>Location Type</Label>
                        <div className="flex space-x-4">
                          <Button 
                            variant={locationType === 'custom' ? 'default' : 'outline'} 
                            onClick={() => setLocationType('custom')}
                            className="flex items-center"
                            type="button"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Custom
                          </Button>
                          <Button 
                            variant={locationType === 'client' ? 'default' : 'outline'} 
                            onClick={() => setLocationType('client')}
                            className="flex items-center"
                            type="button"
                          >
                            <Building2 className="h-4 w-4 mr-2" />
                            Client Site
                          </Button>
                        </div>
                      </div>
                      
                      {locationType === 'custom' ? (
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newTask.location}
                            onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                            placeholder="E.g., Office, Meeting Room, etc."
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="clientLocation">Location</Label>
                            <Select
                              value={newTask.clientId && newTask.clientLocationId ? `${newTask.clientId}:${newTask.clientLocationId}` : ""}
                              onValueChange={(value) => {
                                const parsed = parseClientLocationValue(value);
                                if (parsed) {
                                  setNewTask({
                                    ...newTask,
                                    clientId: parsed.clientId,
                                    clientLocationId: parsed.locationId
                                  });
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select client location" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover">
                                {getClientLocationOptions()}
                              </SelectContent>
                            </Select>
                            
                            {newTask.clientId && newTask.clientLocationId && (
                              <div className="mt-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                                {(() => {
                                  const locationInfo = getClientLocationInfo(newTask.clientId, newTask.clientLocationId);
                                  if (!locationInfo) return null;
                                  
                                  return (
                                    <>
                                      <div className="font-medium">{locationInfo.locationName}</div>
                                      <div>{locationInfo.address}</div>
                                      {locationInfo.city && locationInfo.state && (
                                        <div>{locationInfo.city}, {locationInfo.state} {locationInfo.zipCode}</div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <Button onClick={handleAddTask} className="w-full">
                        Add Schedule
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className={cn("rounded-md border", "pointer-events-auto")}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tasks for {selectedDate.toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks
                    .filter(task => 
                      task.date.toDateString() === selectedDate.toDateString()
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border",
                          task.completed ? "bg-muted/50" : "bg-card"
                        )}
                      >
                        <div className="space-y-1">
                          <span className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                            {task.title}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            <p>{task.startTime} - {task.endTime}</p>
                            
                            {/* Show assignment info */}
                            {task.assignedTo && (
                              <div className="flex items-center mt-1">
                                <User className="h-3 w-3 mr-1" />
                                <span>Assigned to: {task.assignedTo}</span>
                              </div>
                            )}
                            
                            {task.crew && task.crew.length > 0 && (
                              <div className="flex items-center mt-1">
                                <Users className="h-3 w-3 mr-1" />
                                <span>
                                  Crew {task.crewId ? getCrewDisplayCode(task.crewId) : ''}: {task.crew.length} members
                                </span>
                                
                                <div className="flex -space-x-1 ml-2">
                                  {task.crew.slice(0, 3).map((member, i) => (
                                    <Avatar key={i} className="h-5 w-5 border border-background">
                                      <AvatarFallback className="text-[0.6rem]">
                                        {member.substring(0, 1)}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {task.crew.length > 3 && (
                                    <Badge variant="secondary" className="h-5 w-5 rounded-full flex items-center justify-center text-[0.6rem] p-0">
                                      +{task.crew.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Show location info */}
                            {task.location && (
                              <div className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{task.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            setTasks(tasks.map(t =>
                              t.id === task.id ? { ...t, completed: !t.completed } : t
                            ));
                          }}
                          className="h-4 w-4"
                        />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      task.completed ? "bg-muted/50" : "bg-card"
                    )}
                  >
                    <div className="space-y-1">
                      <span className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                        {task.title}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        <p>Date: {task.date.toLocaleDateString()}</p>
                        <p>{task.startTime} - {task.endTime}</p>
                        
                        {/* Show assignment info */}
                        {task.assignedTo && (
                          <div className="flex items-center mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span>Assigned to: {task.assignedTo}</span>
                          </div>
                        )}
                        
                        {task.crew && task.crew.length > 0 && (
                          <div className="flex items-center mt-1">
                            <Users className="h-3 w-3 mr-1" />
                            <span>
                              Crew {task.crewId ? getCrewDisplayCode(task.crewId) : ''}: {task.crew.join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {/* Show location info */}
                        {task.location && (
                          <div className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{task.location}</span>
                            
                            {/* If it's a client location, show detailed info */}
                            {task.clientId && task.clientLocationId && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                {(() => {
                                  const locationInfo = getClientLocationInfo(task.clientId, task.clientLocationId);
                                  if (!locationInfo) return null;
                                  return `(${locationInfo.address}, ${locationInfo.city || ''} ${locationInfo.state || ''})`;
                                })()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        setTasks(tasks.map(t =>
                          t.id === task.id ? { ...t, completed: !t.completed } : t
                        ));
                      }}
                      className="h-4 w-4"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload and Analyze Section at the bottom */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upload & Analyze Schedule</CardTitle>
          <CardDescription>Upload calendar documents or images to extract schedule information automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="schedule-file-upload">Select Schedule File</Label>
            <div className="flex gap-4">
              <Input 
                id="schedule-file-upload" 
                type="file" 
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.csv,.ics"
              />
              <Button 
                onClick={handleAnalyzeFile} 
                disabled={!selectedFile || isAnalyzing}
                variant="secondary"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
            </div>
          </div>

          {analyzedScheduleData && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Extracted Schedule Data:</h3>
              <div className="bg-muted rounded-md p-3">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(analyzedScheduleData, null, 2)}
                </pre>
              </div>
              <Button 
                onClick={handleApplyScheduleData}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Add to Calendar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Event Dialog */}
      <Dialog open={teamEventDialogOpen} onOpenChange={setTeamEventDialogOpen}>
        <DialogContent className="max-w-md bg-[#121212] text-white border-0">
          <div className="absolute right-4 top-4">
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          
          <h2 className="text-2xl font-bold mb-1">Schedule Task</h2>
          <p className="text-gray-400 mb-6">Create a task for Employee - {newTask.assignedTo}</p>
          
          <Tabs defaultValue="basicInfo" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="basicInfo" className="text-base">Basic Info</TabsTrigger>
              <TabsTrigger value="assignment" className="text-base">Assignment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basicInfo" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="h-14 bg-[#1E1E1E] border-0 text-white rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Date</Label>
                  <div className="h-14 bg-[#1E1E1E] rounded-xl flex items-center px-4">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="start-time">Start Time</Label>
                    <div className="relative">
                      <Input 
                        id="start-time" 
                        type="time" 
                        value={newTask.startTime}
                        onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                        className="h-14 bg-[#1E1E1E] border-0 text-white rounded-xl pl-4 pr-12"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        AM
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="end-time">End Time</Label>
                    <div className="relative">
                      <Input 
                        id="end-time" 
                        type="time" 
                        value={newTask.endTime}
                        onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
                        className="h-14 bg-[#1E1E1E] border-0 text-white rounded-xl pl-4 pr-12"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        PM
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Location selection */}
                <div className="space-y-2">
                  <Label className="text-base">Location</Label>
                  <Select
                    value={locationType}
                    onValueChange={(value) => setLocationType(value as 'custom' | 'client')}
                  >
                    <SelectTrigger className="h-14 bg-[#1E1E1E] border-0 text-white rounded-xl">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] border-[#2E2E2E] text-white">
                      <SelectItem value="custom">Custom Location</SelectItem>
                      <SelectItem value="client">Client Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {locationType === 'custom' ? (
                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="location">Location Details</Label>
                    <Input
                      id="location"
                      placeholder="Enter location details"
                      value={newTask.location}
                      onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                      className="h-14 bg-[#1E1E1E] border-0 text-white rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="client-location">Client Location</Label>
                    <Select
                      value={newTask.clientId && newTask.clientLocationId ? `${newTask.clientId}:${newTask.clientLocationId}` : ""}
                      onValueChange={(value) => {
                        const parsed = parseClientLocationValue(value);
                        if (parsed) {
                          setNewTask({
                            ...newTask,
                            clientId: parsed.clientId,
                            clientLocationId: parsed.locationId
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="h-14 bg-[#1E1E1E] border-0 text-white rounded-xl">
                        <SelectValue placeholder="Choose client location" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E1E1E] border-[#2E2E2E] text-white">
                        {getClientLocationOptions()}
                      </SelectContent>
                    </Select>
                    
                    {newTask.clientId && newTask.clientLocationId && (
                      <div className="mt-2 text-sm text-gray-400 bg-[#1A1A1A] p-3 rounded-xl">
                        {(() => {
                          const locationInfo = getClientLocationInfo(newTask.clientId, newTask.clientLocationId);
                          if (!locationInfo) return null;
                          
                          return (
                            <>
                              <div className="font-medium text-white">{locationInfo.locationName}</div>
                              <div>{locationInfo.address}</div>
                              {locationInfo.city && locationInfo.state && (
                                <div>{locationInfo.city}, {locationInfo.state} {locationInfo.zipCode}</div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="assignment" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">Assignment Type</Label>
                  <Select
                    value={assignmentType}
                    onValueChange={(value) => setAssignmentType(value as 'individual' | 'crew')}
                  >
                    <SelectTrigger className="h-14 bg-[#1E1E1E] border-0 text-white rounded-xl">
                      <SelectValue placeholder="Select assignment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] border-[#2E2E2E] text-white">
                      <SelectItem value="individual">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>Individual</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="crew">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Crew</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {assignmentType === 'individual' ? (
                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="employee">Assign To</Label>
                    <Select
                      value={newTask.assignedTo}
                      onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                    >
                      <SelectTrigger className="h-14 bg-[#1E1E1E] border-0 text-white rounded-xl">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E1E1E] border-[#2E2E2E] text-white">
                        {getEmployeeOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-base" htmlFor="crew">Assign To Crew</Label>
                    <Select
                      value={newTask.assignedCrew}
                      onValueChange={(value) => setNewTask({ ...newTask, assignedCrew: value })}
                    >
                      <SelectTrigger className="h-14 bg-[#1E1E1E] border-0 text-white rounded-xl">
                        <SelectValue placeholder="Select crew" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E1E1E] border-[#2E2E2E] text-white">
                        {getCrewOptions()}
                      </SelectContent>
                    </Select>
                    
                    {newTask.assignedCrew && (
                      <div className="mt-3 text-sm text-gray-400 bg-[#1A1A1A] p-3 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">Crew Members</span>
                          <Badge variant="outline" className="text-[0.6rem]">
                            {crews.find(c => c.id === newTask.assignedCrew)?.members.length || 0} members
                          </Badge>
                        </div>
                        <div className="mt-2">{getCrewMemberNames(newTask.assignedCrew)}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-3 mt-4">
            <Button 
              variant="ghost" 
              className="flex-1 h-12 border border-[#333] text-gray-300 hover:text-white"
              onClick={() => setTeamEventDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleCreateTeamEvent}
            >
              Create Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleView;
