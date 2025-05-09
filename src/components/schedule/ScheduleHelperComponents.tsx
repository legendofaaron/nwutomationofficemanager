
import React from 'react';
import { SelectItem } from '@/components/ui/select';
import { Crew, Client, ClientLocation } from './ScheduleTypes';

// Generate crew options for select components
export const getCrewOptions = (crews: Crew[]) => {
  if (!crews || crews.length === 0) {
    return <SelectItem value="no-crews">No crews available</SelectItem>;
  }
  
  return crews.map(crew => (
    <SelectItem key={crew.id} value={crew.id}>
      {crew.name} ({crew.members.length} members)
    </SelectItem>
  ));
};

// Generate client options for select components
export const getClientOptions = (clients: Client[]) => {
  if (!clients || clients.length === 0) {
    return <SelectItem value="no-clients">No clients available</SelectItem>;
  }
  
  return clients.map(client => (
    <SelectItem key={client.id} value={client.id}>
      {client.name}
    </SelectItem>
  ));
};

// Generate client location options for select components
export const getClientLocationOptions = (clientLocations: ClientLocation[], clientId?: string) => {
  if (!clientLocations || clientLocations.length === 0) {
    return <SelectItem value="no-locations">No locations available</SelectItem>;
  }
  
  // If clientId is provided, filter locations for that client
  const filteredLocations = clientId 
    ? clientLocations.filter(location => location.clientId === clientId) 
    : clientLocations;
  
  if (filteredLocations.length === 0) {
    return <SelectItem value="no-locations">No locations for this client</SelectItem>;
  }
  
  return filteredLocations.map(location => (
    <SelectItem key={location.id} value={location.id}>
      {location.name} {location.isPrimary ? '(Primary)' : ''}
    </SelectItem>
  ));
};

// Generate combined client:location options for select components
export const getClientLocationCombinedOptions = (clients: Client[], clientLocations: ClientLocation[]) => {
  if (!clients || clients.length === 0 || !clientLocations || clientLocations.length === 0) {
    return <SelectItem value="no-options">No options available</SelectItem>;
  }
  
  return clients.map(client => {
    const clientLocsList = clientLocations.filter(loc => loc.clientId === client.id);
    
    if (clientLocsList.length === 0) {
      return (
        <SelectItem key={`client-${client.id}`} value={`${client.id}:none`} disabled>
          {client.name} (No locations)
        </SelectItem>
      );
    }
    
    return clientLocsList.map(loc => (
      <SelectItem key={`${client.id}-${loc.id}`} value={`${client.id}:${loc.id}`}>
        {client.name} - {loc.name}
      </SelectItem>
    ));
  }).flat();
};

// Format date for display
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Format time for display
export const formatTime = (time?: string): string => {
  if (!time) return '';
  
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};
