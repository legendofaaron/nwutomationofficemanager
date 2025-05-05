
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, User, MapPin, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Task, TaskFormData, AssignmentType, LocationType, 
} from './ScheduleTypes';
import { 
  getEmployeeOptions, getCrewOptions, getClientLocationOptions, 
  parseClientLocationValue, getCrewMemberNames, getCrewDisplayCode, 
  getClientLocationInfo 
} from './ScheduleHelpers';

interface TaskCalendarViewProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  tasks: Task[];
  onToggleTaskCompletion: (taskId: string) => void;
  onAddTask: (task: Task) => void;
  employees: any[];
  crews: any[];
  clients: any[];
  clientLocations: any[];
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({
  selectedDate,
  setSelectedDate,
  tasks,
  onToggleTaskCompletion,
  onAddTask,
  employees,
  crews,
  clients,
  clientLocations,
}) => {
  const [newTask, setNewTask] = React.useState<TaskFormData>({
    title: '',
    assignedTo: '',
    assignedCrew: '',
    startTime: '',
    endTime: '',
    location: '',
    clientId: '',
    clientLocationId: ''
  });
  
  const [assignmentType, setAssignmentType] = React.useState<AssignmentType>('individual');
  const [locationType, setLocationType] = React.useState<LocationType>('custom');

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
        const client = clients.find(c => c.id === newTask.clientId);
        const location = clientLocations.find(l => l.id === newTask.clientLocationId);
        
        if (client && location) {
          task.location = `${client.name} - ${location.name}`;
          task.clientId = newTask.clientId;
          task.clientLocationId = newTask.clientLocationId;
        }
      }
      
      onAddTask(task);
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

  const filteredTasks = tasks.filter(task => 
    task.date.toDateString() === selectedDate.toDateString()
  );

  return (
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
                        {getEmployeeOptions(employees)}
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
                        {getCrewOptions(crews)}
                      </SelectContent>
                    </Select>
                    
                    {newTask.assignedCrew && (
                      <div className="mt-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                        <strong>Crew members:</strong> {getCrewMemberNames(newTask.assignedCrew, crews, employees)}
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
                
                {/* Location selection UI */}
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
                          {getClientLocationOptions(clients, clientLocations)}
                        </SelectContent>
                      </Select>
                      
                      {newTask.clientId && newTask.clientLocationId && (
                        <div className="mt-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                          {(() => {
                            const locationInfo = getClientLocationInfo(
                              newTask.clientId, 
                              newTask.clientLocationId,
                              clients,
                              clientLocations
                            );
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
            {filteredTasks.map((task) => (
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
                          Crew {task.crewId ? getCrewDisplayCode(task.crewId, crews) : ''}: {task.crew.length} members
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
                  onChange={() => onToggleTaskCompletion(task.id)}
                  className="h-4 w-4"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendarView;
