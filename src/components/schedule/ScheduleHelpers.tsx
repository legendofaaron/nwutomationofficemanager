import React from 'react';
import { SelectItem } from '@/components/ui/select';
import { Client, ClientLocation, ClientLocationInfo, Crew, Employee } from './ScheduleTypes';

// Helper function to get employee options for dropdowns
export const getEmployeeOptions = (employees: Employee[]): React.ReactNode[] => {
  return employees.map(employee => (
    <SelectItem key={employee.id} value={employee.id}>
      {employee.name} {employee.position ? `- ${employee.position}` : ''}
    </SelectItem>
  ));
};

// Helper function to get crew options for dropdowns
export const getCrewOptions = (crews: Crew[]): React.ReactNode[] => {
  return crews.map(crew => (
    <SelectItem key={crew.id} value={crew.id}>
      {crew.name} ({crew.members.length} members)
    </SelectItem>
  ));
};

// Helper function to get client location options for dropdowns
export const getClientLocationOptions = (
  clients: Client[],
  clientLocations: ClientLocation[]
): React.ReactNode[] => {
  const options: React.ReactNode[] = [];
  
  clients.forEach(client => {
    const clientLocs = clientLocations.filter(loc => loc.clientId === client.id);
    
    if (clientLocs.length > 0) {
      // Add client group label
      options.push(
        <SelectItem key={client.id} value={`group-${client.id}`} disabled className="font-semibold">
          {client.name}
        </SelectItem>
      );
      
      // Add locations for this client
      clientLocs.forEach(location => {
        options.push(
          <SelectItem key={location.id} value={`${client.id}:${location.id}`} className="pl-6">
            {location.name} {location.isPrimary ? "(Primary)" : ""}
          </SelectItem>
        );
      });
    }
  });
  
  return options;
};

// Helper function to parse client location value from dropdown
export const parseClientLocationValue = (value: string): { clientId: string; locationId: string } | null => {
  if (!value || !value.includes(':')) return null;
  
  const [clientId, locationId] = value.split(':');
  return { clientId, locationId };
};

// Helper function to get crew member names from member IDs
export const getCrewMemberNames = (memberIds: string[], employees: Employee[]): string[] => {
  return memberIds.map(id => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : '';
  }).filter(Boolean);
};

// Helper function to get client location details
export const getClientLocationInfo = (
  clientId: string,
  locationId: string,
  clients: Client[],
  clientLocations: ClientLocation[]
): ClientLocationInfo | null => {
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

// Helper function to get crew display code
export const getCrewDisplayCode = (crewId: string, crews: Crew[]): string => {
  const crewIndex = crews.findIndex(crew => crew.id === crewId);
  return crewIndex >= 0 ? getCrewLetterCode(crewIndex) : '';
};

// Helper function to generate crew letter codes
export const getCrewLetterCode = (index: number): string => {
  // For the first 26 crews, use A-Z
  if (index < 26) {
    return String.fromCharCode(65 + index); // A = 65 in ASCII
  } 
  
  // For crews beyond 26, use A2, B2, C2, etc.
  const cycle = Math.floor(index / 26);
  const letter = String.fromCharCode(65 + (index % 26));
  return `${letter}${cycle + 1}`;
};

// Helper function to format date range for display
export const formatDateRange = (start: Date, end: Date): string => {
  // If same day, just show one date
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString();
  }
  
  // Otherwise show range
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
};

// Helper function to create drag preview element
export const createDragPreview = (title: string, type: string): HTMLElement => {
  const preview = document.createElement('div');
  preview.className = `${type}-drag-preview`;
  
  let icon = '📄';
  switch (type) {
    case 'task':
      icon = '📋';
      break;
    case 'employee':
      icon = '👤';
      break;
    case 'crew':
      icon = '👥';
      break;
    case 'client':
      icon = '🏢';
      break;
    default:
      icon = '📄';
  }
  
  preview.innerHTML = `<div class="flex items-center gap-1.5 px-2 py-1 bg-primary text-primary-foreground rounded-md shadow-md whitespace-nowrap text-sm max-w-[200px] truncate">
    <span class="inline-block">${icon}</span> ${title || type}
  </div>`;
  
  return preview;
};
