
import { Client, ClientLocation, Crew, Employee } from './ScheduleTypes';

// Parse a combined client:location value into separate IDs
export const parseClientLocationValue = (value: string): { clientId: string; locationId: string } | null => {
  if (!value || !value.includes(':')) return null;
  
  const [clientId, locationId] = value.split(':');
  if (locationId === 'none') return { clientId, locationId: '' };
  
  return { clientId, locationId };
};

// Get crew member names as a formatted string
export const getCrewMemberNames = (
  crewId: string, 
  crews: Crew[], 
  employees: Employee[]
): string => {
  if (!crewId || !crews || !crews.length) return 'No members';
  
  const crew = crews.find(c => c.id === crewId);
  if (!crew || !crew.members || !crew.members.length) return 'No members';
  
  const memberNames = crew.members.map(memberId => {
    const employee = employees.find(e => e.id === memberId);
    return employee ? employee.name : 'Unknown';
  });
  
  return memberNames.join(', ');
};

// Get detailed client location information
export const getClientLocationInfo = (
  clientId: string,
  locationId: string,
  clients: Client[],
  clientLocations: ClientLocation[]
): { 
  clientName: string; 
  locationName: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
} | null => {
  if (!clientId || !locationId || !clients || !clientLocations) return null;
  
  const client = clients.find(c => c.id === clientId);
  const location = clientLocations.find(l => l.id === locationId);
  
  if (!client || !location) return null;
  
  return {
    clientName: client.name,
    locationName: location.name,
    address: location.address || '',
    city: location.city,
    state: location.state,
    zipCode: location.zipCode
  };
};

// Helper for client location options in TeamEventDialog
export const getClientLocationOptions = (clients: Client[], clientLocations: ClientLocation[]) => {
  const options = [];
  
  for (const client of clients) {
    const locations = clientLocations.filter(loc => loc.clientId === client.id);
    
    for (const location of locations) {
      options.push({
        value: `${client.id}:${location.id}`,
        label: `${client.name} - ${location.name}`
      });
    }
  }
  
  return options;
};
