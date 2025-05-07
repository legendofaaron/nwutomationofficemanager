
import React from 'react';
import { SelectItem, SelectLabel, SelectGroup } from "@/components/ui/select";
import { Employee, Crew, Client, ClientLocation } from './ScheduleTypes';

// Helper to get employee options for select
export const getEmployeeOptions = (employees: Employee[]) => {
  return employees.map(employee => (
    <SelectItem key={employee.id} value={employee.id}>
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
