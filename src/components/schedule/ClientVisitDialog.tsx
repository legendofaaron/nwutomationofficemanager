
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Crew, Client, ClientLocation } from './ScheduleTypes';
import { getCrewOptions, getClientLocationOptions } from './ScheduleHelperComponents';

interface ClientVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateVisit: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  selectedDate: Date;
  crews: Crew[];
  clients: Client[];
  clientLocations: ClientLocation[];
  droppedClientId: string | null;
}

const ClientVisitDialog: React.FC<ClientVisitDialogProps> = ({
  open,
  onOpenChange,
  onCreateVisit,
  formData,
  setFormData,
  selectedDate,
  crews,
  clients,
  clientLocations,
  droppedClientId
}) => {
  // Set up client locations based on selected client
  useEffect(() => {
    if (droppedClientId) {
      // Pre-select the client if dropped
      setFormData(prevData => ({
        ...prevData,
        clientId: droppedClientId
      }));
      
      // Find primary location for this client
      const primaryLocation = clientLocations.find(
        loc => loc.clientId === droppedClientId && loc.isPrimary
      );
      
      if (primaryLocation) {
        setFormData(prevData => ({
          ...prevData,
          clientLocationId: primaryLocation.id
        }));
      }
    }
  }, [droppedClientId, clientLocations, setFormData]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Filter locations for the selected client
  const filteredLocations = formData.clientId 
    ? clientLocations.filter(location => location.clientId === formData.clientId)
    : [];

  return (
    <div className="space-y-4 pt-2">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="title">Visit Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            placeholder="Client Visit"
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            value={format(selectedDate, 'MMMM d, yyyy')}
            disabled
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="assignedCrew">Assign Crew</Label>
          <Select
            value={formData.assignedCrew || ''}
            onValueChange={(value) => handleSelectChange('assignedCrew', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a crew" />
            </SelectTrigger>
            <SelectContent>
              {getCrewOptions(crews)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="clientLocation">Client Location</Label>
          <Select
            value={formData.clientLocationId || ''}
            onValueChange={(value) => handleSelectChange('clientLocationId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {filteredLocations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}{location.isPrimary ? ' (Primary)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Visit Details</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="Enter details about the client visit..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onCreateVisit}>
          Schedule Visit
        </Button>
      </div>
    </div>
  );
};

export default ClientVisitDialog;
