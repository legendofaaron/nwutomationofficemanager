import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Clock, MapPin, User, Users, X, Building2, Pencil, Save } from 'lucide-react';
import { format } from 'date-fns';
import { TaskFormData, Task, Crew, Employee, Client, ClientLocation, LocationType, AssignmentType } from './ScheduleTypes';
import { parseClientLocationValue, getCrewMemberNames, getClientLocationInfo } from './ScheduleHelpers';
import { getEmployeeOptions, getCrewOptions, getClientLocationOptions } from './ScheduleHelperComponents';

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
  const [formData, setFormData] = React.useState<TaskFormData>({
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

  // Initialize form data when task changes
  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        assignedTo: task.assignedTo || '',
        assignedCrew: task.crewId || '',
        startTime: task.startTime || '',
        endTime: task.endTime || '',
        location: task.location || '',
        clientId: task.clientId || '',
        clientLocationId: task.clientLocationId || ''
      });

      // Set assignment type
      if (task.crew && task.crew.length > 0) {
        setAssignmentType('crew');
      } else {
        setAssignmentType('individual');
      }

      // Set location type
      if (task.clientId && task.clientLocationId) {
        setLocationType('client');
      } else {
        setLocationType('custom');
      }
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;

    const updatedTask: Partial<Task> = {
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    // Handle assignment based on selected type
    if (assignmentType === 'individual') {
      updatedTask.assignedTo = formData.assignedTo;
      updatedTask.crew = undefined;
      updatedTask.crewId = undefined;
    } else if (assignmentType === 'crew') {
      updatedTask.assignedTo = undefined;
      
      // Get crew members' names
      const selectedCrew = crews.find(crew => crew.id === formData.assignedCrew);
      if (selectedCrew) {
        updatedTask.crew = selectedCrew.members.map(memberId => {
          const employee = employees.find(emp => emp.id === memberId);
          return employee ? employee.name : '';
        }).filter(name => name !== '');
        updatedTask.crewId = formData.assignedCrew;
      }
    }

    // Handle location based on selected type
    if (locationType === 'custom') {
      updatedTask.location = formData.location;
      updatedTask.clientId = undefined;
      updatedTask.clientLocationId = undefined;
    } else if (locationType === 'client') {
      const client = clients.find(c => c.id === formData.clientId);
      const location = clientLocations.find(l => l.id === formData.clientLocationId);
      
      if (client && location) {
        updatedTask.location = `${client.name} - ${location.name}`;
        updatedTask.clientId = formData.clientId;
        updatedTask.clientLocationId = formData.clientLocationId;
      }
    }

    onSaveChanges(task.id, updatedTask);
    onOpenChange(false);
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Pencil className="h-4 w-4 text-blue-500" />
          <h3 className="text-lg font-medium">Edit Task</h3>
        </div>
      </div>

      <Tabs defaultValue="basicInfo" className="w-full">
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">Date</Label>
              <div className="h-11 bg-muted dark:bg-[#1E1E1E] dark:border-gray-700 rounded-lg flex items-center px-4 gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{task && format(task.date, 'MMMM d, yyyy')}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base" htmlFor="start-time">Start Time</Label>
                <div className="relative">
                  <Input 
                    id="start-time" 
                    type="time" 
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg pl-4 pr-12"
                  />
                  <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-base" htmlFor="end-time">End Time</Label>
                <div className="relative">
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg pl-4 pr-12"
                  />
                  <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">Location Type</Label>
              <div className="flex space-x-4">
                <Button 
                  variant={locationType === 'custom' ? 'default' : 'outline'} 
                  onClick={() => setLocationType('custom')}
                  className="flex items-center flex-1"
                  type="button"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Custom
                </Button>
                <Button 
                  variant={locationType === 'client' ? 'default' : 'outline'} 
                  onClick={() => setLocationType('client')}
                  className="flex items-center flex-1"
                  type="button"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Client Site
                </Button>
              </div>
            </div>
            
            {locationType === 'custom' ? (
              <div className="space-y-2">
                <Label className="text-base" htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="E.g., Office, Meeting Room, etc."
                  className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base" htmlFor="clientLocation">Client Location</Label>
                  <Select
                    value={formData.clientId && formData.clientLocationId ? `${formData.clientId}:${formData.clientLocationId}` : ""}
                    onValueChange={(value) => {
                      const parsed = parseClientLocationValue(value);
                      if (parsed) {
                        setFormData({
                          ...formData,
                          clientId: parsed.clientId,
                          clientLocationId: parsed.locationId
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg">
                      <SelectValue placeholder="Select client location" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-[#1D1D1D] dark:border-gray-700">
                      {getClientLocationOptions(clients, clientLocations)}
                    </SelectContent>
                  </Select>
                  
                  {formData.clientId && formData.clientLocationId && (
                    <div className="mt-2 text-sm text-muted-foreground bg-muted/30 dark:bg-[#1A1A1A] p-3 rounded-md">
                      {(() => {
                        const locationInfo = getClientLocationInfo(formData.clientId, formData.clientLocationId, clients, clientLocations);
                        if (!locationInfo) return null;
                        
                        return (
                          <>
                            <div className="font-medium text-foreground dark:text-gray-100">{locationInfo.locationName}</div>
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
          </div>
        </TabsContent>
        
        <TabsContent value="assignment" className="space-y-6 mt-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Assignment Type</Label>
              <div className="flex space-x-4">
                <Button 
                  variant={assignmentType === 'individual' ? 'default' : 'outline'} 
                  onClick={() => setAssignmentType('individual')}
                  className="flex items-center flex-1"
                  type="button"
                >
                  <User className="h-4 w-4 mr-2" />
                  Individual
                </Button>
                <Button 
                  variant={assignmentType === 'crew' ? 'default' : 'outline'} 
                  onClick={() => setAssignmentType('crew')}
                  className="flex items-center flex-1"
                  type="button"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Crew
                </Button>
              </div>
            </div>
            
            {assignmentType === 'individual' ? (
              <div className="space-y-2">
                <Label className="text-base" htmlFor="employee">Assign To</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                >
                  <SelectTrigger className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1D1D1D] dark:border-gray-700">
                    {getEmployeeOptions(employees)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-base" htmlFor="crew">Assign To Crew</Label>
                <Select
                  value={formData.assignedCrew}
                  onValueChange={(value) => setFormData({ ...formData, assignedCrew: value })}
                >
                  <SelectTrigger className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg">
                    <SelectValue placeholder="Select crew" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1D1D1D] dark:border-gray-700">
                    {getCrewOptions(crews)}
                  </SelectContent>
                </Select>
                
                {formData.assignedCrew && (
                  <div className="mt-2 text-sm text-muted-foreground bg-muted/30 dark:bg-[#1A1A1A] p-3 rounded-md">
                    <div className="font-medium text-foreground dark:text-gray-100">Crew members:</div>
                    <div className="mt-1">{getCrewMemberNames(formData.assignedCrew, crews, employees)}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          className="gap-1"
        >
          <X className="h-4 w-4" /> Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          className="gap-1"
        >
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

export default TaskEditDialog;
