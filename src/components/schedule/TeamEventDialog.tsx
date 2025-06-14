
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Clock, MapPin, User, Users, X, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { TaskFormData, Crew, Employee, Client, ClientLocation, LocationType, AssignmentType } from './ScheduleTypes';
import { getEmployeeOptions, getCrewOptions, getClientLocationOptions, parseClientLocationValue, getCrewMemberNames, getClientLocationInfo } from './ScheduleHelpers';

interface TeamEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: () => void;
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  assignmentType: AssignmentType;
  setAssignmentType: React.Dispatch<React.SetStateAction<AssignmentType>>;
  locationType: LocationType;
  setLocationType: React.Dispatch<React.SetStateAction<LocationType>>;
  selectedDate: Date;
  crews: Crew[];
  employees: Employee[];
  clients: Client[];
  clientLocations: ClientLocation[];
}

const TeamEventDialog: React.FC<TeamEventDialogProps> = ({
  open,
  onOpenChange,
  onCreateEvent,
  formData,
  setFormData,
  assignmentType,
  setAssignmentType,
  locationType,
  setLocationType,
  selectedDate,
  crews,
  employees,
  clients,
  clientLocations
}) => {
  return (
    <div className="space-y-6 py-2">
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
                <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
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
                  value={formData.assignedTo || ""}
                  onValueChange={(value) => setFormData({ ...formData, assignedTo: value, assignedCrew: '' })}
                >
                  <SelectTrigger id="employee" className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1D1D1D] dark:border-gray-700 max-h-[300px] overflow-y-auto">
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.name} {employee.position ? `- ${employee.position}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.assignedTo && (
                  <div className="mt-2 text-sm bg-muted/30 dark:bg-[#1A1A1A] p-3 rounded-md">
                    <div className="font-medium text-foreground dark:text-gray-100">
                      Task will be assigned to {formData.assignedTo}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-base" htmlFor="crew">Assign To Crew</Label>
                <Select
                  value={formData.assignedCrew || ""}
                  onValueChange={(value) => setFormData({ ...formData, assignedCrew: value, assignedTo: '' })}
                >
                  <SelectTrigger id="crew" className="h-11 dark:bg-[#1E1E1E] dark:border-gray-700 dark:text-white rounded-lg">
                    <SelectValue placeholder="Select crew" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1D1D1D] dark:border-gray-700 max-h-[300px] overflow-y-auto">
                    {crews.map(crew => (
                      <SelectItem 
                        key={crew.id} 
                        value={crew.id}
                        description={`${crew.members.length} members`}
                      >
                        {crew.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.assignedCrew && (
                  <div className="mt-2 text-sm text-muted-foreground bg-muted/30 dark:bg-[#1A1A1A] p-3 rounded-md">
                    <div className="font-medium text-foreground dark:text-gray-100">Crew members:</div>
                    <div className="mt-1">
                      {(() => {
                        const selectedCrew = crews.find(c => c.id === formData.assignedCrew);
                        if (!selectedCrew) return "No members found";
                        
                        return selectedCrew.members.map(memberId => {
                          const employee = employees.find(e => e.id === memberId);
                          return employee ? employee.name : "";
                        }).filter(Boolean).join(", ");
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Button 
        onClick={onCreateEvent} 
        disabled={!formData.title || (!formData.assignedTo && !formData.assignedCrew)}
        className="w-full mt-4 h-11 text-base"
      >
        Create Task
      </Button>
    </div>
  );
};

export default TeamEventDialog;
