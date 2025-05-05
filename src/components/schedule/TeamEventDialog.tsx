
import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog, DialogContent, DialogClose
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, User, Users, MapPin, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TaskFormData, AssignmentType, LocationType } from './ScheduleTypes';
import { 
  getEmployeeOptions, getCrewOptions, getClientLocationOptions, 
  parseClientLocationValue, getCrewMemberNames, getClientLocationInfo 
} from './ScheduleHelpers';

interface TeamEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: TaskFormData;
  setNewTask: (task: TaskFormData) => void;
  selectedDate: Date;
  assignmentType: AssignmentType;
  setAssignmentType: (type: AssignmentType) => void;
  locationType: LocationType;
  setLocationType: (type: LocationType) => void;
  handleCreateTeamEvent: () => void;
  employees: any[];
  crews: any[];
  clients: any[];
  clientLocations: any[];
}

const TeamEventDialog: React.FC<TeamEventDialogProps> = ({
  open,
  onOpenChange,
  newTask,
  setNewTask,
  selectedDate,
  assignmentType,
  setAssignmentType,
  locationType,
  setLocationType,
  handleCreateTeamEvent,
  employees,
  crews,
  clients,
  clientLocations
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                      {getClientLocationOptions(clients, clientLocations)}
                    </SelectContent>
                  </Select>
                  
                  {newTask.clientId && newTask.clientLocationId && (
                    <div className="mt-2 text-sm text-gray-400 bg-[#1A1A1A] p-3 rounded-xl">
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
                      {getEmployeeOptions(employees)}
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
                      {getCrewOptions(crews)}
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
                      <div className="mt-2">{getCrewMemberNames(newTask.assignedCrew, crews, employees)}</div>
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
            onClick={() => onOpenChange(false)}
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
  );
};

export default TeamEventDialog;
