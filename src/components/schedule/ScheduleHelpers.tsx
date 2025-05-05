import React from 'react';
import { SelectItem, SelectLabel, SelectGroup } from "@/components/ui/select";
import { 
  Task, Employee, Crew, Client, ClientLocation, ClientLocationInfo 
} from "./ScheduleTypes";
import { getCrewLetterCode } from "@/components/ui/calendar";

// Helper to get employee options for select
export const getEmployeeOptions = (employees: Employee[]) => {
  return employees.map(employee => (
    <SelectItem key={employee.id} value={employee.name}>
      {employee.name}
    </SelectItem>
  ));
};

// Helper to get crew options for select
export const getCrewOptions = (crews: Crew[]) => {
  return crews.map(crew => (
    <SelectItem key={crew.id} value={crew.id}>
      {crew.name} ({crew.members.length} members)
    </SelectItem>
  ));
};

// Helper to get client location options for select
export const getClientLocationOptions = (clients: Client[], clientLocations: ClientLocation[]) => {
  const options: JSX.Element[] = [];
  
  clients.forEach(client => {
    const clientLocationsFiltered = clientLocations.filter(
      location => location.clientId === client.id
    );
    
    if (clientLocationsFiltered.length > 0) {
      // Add a SelectGroup with a label for this client
      options.push(
        <SelectGroup key={`client-group-${client.id}`}>
          <SelectLabel key={`client-${client.id}`} className="font-medium">
            {client.name}
          </SelectLabel>
          
          {/* Add each location under this client */}
          {clientLocationsFiltered.map(location => {
            const value = `${client.id}:${location.id}`;
            const displayText = `${location.name}${location.isPrimary ? " (Primary)" : ""}`;
            
            return (
              <SelectItem 
                key={value} 
                value={value}
                className="pl-6"
              >
                {displayText}
              </SelectItem>
            );
          })}
        </SelectGroup>
      );
    }
  });
  
  return options;
};

// Helper to parse the combined client:location value
export const parseClientLocationValue = (value: string): { clientId: string, locationId: string } | null => {
  if (!value || !value.includes(':')) return null;
  
  const [clientId, locationId] = value.split(':');
  return { clientId, locationId };
};

// Helper to get crew member names for display
export const getCrewMemberNames = (crewId: string, crews: Crew[], employees: Employee[]) => {
  const crew = crews.find(c => c.id === crewId);
  if (!crew) return "No members";
  
  const memberNames = crew.members.map(memberId => {
    const employee = employees.find(emp => emp.id === memberId);
    return employee ? employee.name : "";
  }).filter(Boolean);
  
  return memberNames.join(", ");
};

// Helper function to get crew letter code
export const getCrewDisplayCode = (crewId: string, crews: Crew[]): string => {
  const crewIndex = crews.findIndex(crew => crew.id === crewId);
  return crewIndex >= 0 ? getCrewLetterCode(crewIndex) : '';
};

// Helper to get client location info
export const getClientLocationInfo = (
  clientId: string, 
  locationId: string, 
  clients: Client[], 
  clientLocations: ClientLocation[]
): ClientLocationInfo | null => {
  if (!clientId || !locationId) return null;
  
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
