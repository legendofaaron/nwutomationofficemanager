
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Task, Client, ClientLocation, Employee, Crew, AssignmentType, LocationType } from './ScheduleTypes';

interface TaskEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveChanges: (taskId: string, updatedData: Partial<Task>) => void;
  task: Task | null;
  crews: Crew[];
  employees: Employee[];
  clients: Client[];
  clientLocations: ClientLocation[];
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  open, 
  onOpenChange, 
  onSaveChanges, 
  task,
  crews,
  employees,
  clients,
  clientLocations
}) => {
  // Local state for form data
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('individual');
  const [locationType, setLocationType] = useState<LocationType>('custom');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedCrew, setAssignedCrew] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientLocationId, setClientLocationId] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<ClientLocation[]>([]);
  const [completed, setCompleted] = useState(false);

  // Initialize form data when task changes
  useEffect(() => {
    if (!task) return;

    setTitle(task.title || '');
    setDescription(task.description || '');
    setAssignedTo(task.assignedTo || '');
    setStartTime(task.startTime || '');
    setEndTime(task.endTime || '');
    setLocation(task.location || '');
    setClientId(task.clientId || '');
    setClientLocationId(task.clientLocationId || '');
    setCompleted(task.completed || false);
    
    // Determine assignment type
    if (task.crewId) {
      setAssignmentType('crew');
      setAssignedCrew(task.crewId);
    } else {
      setAssignmentType('individual');
    }
    
    // Determine location type
    if (task.clientId) {
      setLocationType('client');
    } else {
      setLocationType('custom');
    }
  }, [task]);

  // Filter client locations when client changes
  useEffect(() => {
    if (clientId) {
      const locations = clientLocations.filter(loc => loc.clientId === clientId);
      setFilteredLocations(locations);
      
      // If current location isn't for this client, reset it
      if (locations.length > 0 && !locations.some(loc => loc.id === clientLocationId)) {
        setClientLocationId(locations[0].id);
      }
    } else {
      setFilteredLocations([]);
      setClientLocationId('');
    }
  }, [clientId, clientLocationId, clientLocations]);

  // Handle save changes
  const handleSave = () => {
    if (!task) return;
    
    const updatedTask: Partial<Task> = {
      title,
      description,
      startTime,
      endTime,
      completed
    };
    
    // Handle assignment based on selected type
    if (assignmentType === 'individual') {
      updatedTask.assignedTo = assignedTo;
      updatedTask.crewId = undefined;
      updatedTask.crewName = undefined;
      updatedTask.crew = undefined;
    } else if (assignmentType === 'crew') {
      updatedTask.assignedTo = undefined;
      updatedTask.crewId = assignedCrew;
      
      // Get crew name
      const selectedCrew = crews.find(c => c.id === assignedCrew);
      if (selectedCrew) {
        updatedTask.crewName = selectedCrew.name;
        updatedTask.crew = selectedCrew.members;
      }
    }
    
    // Handle location based on selected type
    if (locationType === 'custom') {
      updatedTask.location = location;
      updatedTask.clientId = undefined;
      updatedTask.clientLocationId = undefined;
    } else if (locationType === 'client') {
      updatedTask.clientId = clientId;
      updatedTask.clientLocationId = clientLocationId;
      
      // Get location name
      const selectedLocation = clientLocations.find(loc => loc.id === clientLocationId);
      if (selectedLocation) {
        updatedTask.location = selectedLocation.address;
      }
    }
    
    onSaveChanges(task.id, updatedTask);
    onOpenChange(false);
  };

  // Tab handling
  const handleAssignmentTabChange = (value: string) => {
    setAssignmentType(value as AssignmentType);
  };

  const handleLocationTabChange = (value: string) => {
    setLocationType(value as LocationType);
  };

  return (
    <div className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add task details"
          rows={3}
        />
      </div>

      <div>
        <Label>Date</Label>
        <div className="border rounded-md p-2 bg-muted/30">
          {task ? format(task.date, 'MMMM d, yyyy') : 'No date selected'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      
      {/* Assignment section */}
      <div>
        <Label>Assigned To</Label>
        <Tabs value={assignmentType} onValueChange={handleAssignmentTabChange} className="mt-1">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual">
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
          
          <TabsContent value="crew">
            <Select value={assignedCrew} onValueChange={setAssignedCrew}>
              <SelectTrigger>
                <SelectValue placeholder="Select crew" />
              </SelectTrigger>
              <SelectContent>
                {crews.map((crew) => (
                  <SelectItem key={crew.id} value={crew.id}>
                    {crew.name} ({crew.members.length} members)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Location section */}
      <div>
        <Label>Location</Label>
        <Tabs value={locationType} onValueChange={handleLocationTabChange} className="mt-1">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>
          
          <TabsContent value="custom">
            <Input
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </TabsContent>
          
          <TabsContent value="client">
            <div className="space-y-2">
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {clientId && (
                <Select 
                  value={clientLocationId} 
                  onValueChange={setClientLocationId}
                  disabled={filteredLocations.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} - {location.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Task status */}
      <div className="flex items-center space-x-2">
        <Switch 
          checked={completed} 
          onCheckedChange={setCompleted} 
          id="task-completed"
        />
        <Label htmlFor="task-completed">Mark as completed</Label>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default TaskEditDialog;
