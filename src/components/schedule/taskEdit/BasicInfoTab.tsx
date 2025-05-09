
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Clock, MapPin, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { Task, TaskFormData, LocationType, Client, ClientLocation } from '../ScheduleTypes';
import { getClientLocationOptions, parseClientLocationValue, getClientLocationInfo } from '../ScheduleHelpers';

interface BasicInfoTabProps {
  task: Task | null;
  formData: TaskFormData;
  setFormData: (data: TaskFormData) => void;
  locationType: LocationType;
  setLocationType: (type: LocationType) => void;
  clients: Client[];
  clientLocations: ClientLocation[];
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  task,
  formData,
  setFormData,
  locationType,
  setLocationType,
  clients,
  clientLocations
}) => {
  return (
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
  );
};

export default BasicInfoTab;
