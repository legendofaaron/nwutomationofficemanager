import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Loader2, CheckCircle, Users, User, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  assignedTo?: string;
  crew?: string[];
  startTime?: string;
  endTime?: string;
}

const mockEmployees = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Sarah Johnson' },
  { id: '3', name: 'Michael Brown' },
];

const ScheduleView = () => {
  const { employees, crews } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      completed: false,
      assignedTo: 'John Smith',
      startTime: '09:00',
      endTime: '10:00'
    },
    {
      id: '2',
      title: 'Project Review',
      date: new Date(),
      completed: true,
      assignedTo: 'Sarah Johnson',
      startTime: '14:00',
      endTime: '15:00'
    },
    {
      id: '3',
      title: 'Site Inspection',
      date: new Date(),
      completed: false,
      crew: ['John Smith', 'Michael Brown'],
      startTime: '13:00',
      endTime: '16:00'
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: '',
    assignedCrew: '',
    startTime: '',
    endTime: ''
  });

  // Add new states for upload and analyze functionality
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedScheduleData, setAnalyzedScheduleData] = useState<Partial<Task> | null>(null);
  const [assignmentType, setAssignmentType] = useState<'individual' | 'crew'>('individual');
  
  // New state for team event dialog
  const [teamEventDialogOpen, setTeamEventDialogOpen] = useState(false);
  const [droppedCrewId, setDroppedCrewId] = useState<string | null>(null);

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
        }
      }
      
      setTasks([...tasks, task]);
      setNewTask({ title: '', assignedTo: '', assignedCrew: '', startTime: '', endTime: '' });
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
      startTime: newTask.startTime,
      endTime: newTask.endTime
    };
    
    setTasks([...tasks, teamEvent]);
    setTeamEventDialogOpen(false);
    setNewTask({ title: '', assignedTo: '', assignedCrew: '', startTime: '', endTime: '' });
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
                                <span>Crew: {task.crew.length} members</span>
                                
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
                            <span>Crew: {task.crew.join(', ')}</span>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Team Event</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="crew">Team</Label>
              <Select
                value={newTask.assignedCrew}
                onValueChange={(value) => setNewTask({ ...newTask, assignedCrew: value })}
                disabled={!!droppedCrewId}
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
                  <div className="font-medium flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Team Members:</span>
                  </div>
                  <div className="mt-1">
                    {getCrewMemberNames(newTask.assignedCrew)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="flex items-center space-x-2 border rounded-md p-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{selectedDate.toLocaleDateString()}</span>
              </div>
            </div>
            
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
            
            <Button onClick={handleCreateTeamEvent} className="w-full">
              Schedule Team Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleView;
