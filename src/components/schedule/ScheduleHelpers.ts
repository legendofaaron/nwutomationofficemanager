
import { Task, Crew, Employee, Client, ClientLocation } from './ScheduleTypes';
import { isSameDay } from '@/components/calendar/CalendarUtils';
import React from 'react';
import { SelectItem, SelectLabel, SelectGroup } from "@/components/ui/select";

/**
 * Get display code for crew (used in various components)
 */
export const getCrewDisplayCode = (crewId: string, crews: Crew[]): string => {
  // Find the crew
  const index = crews.findIndex(crew => crew.id === crewId);
  if (index === -1) return '';
  
  // Return a code like "A", "B", "C", etc.
  return String.fromCharCode(65 + index);
};

/**
 * Check if two schedules conflict (overlapping times on same day)
 */
export const doSchedulesConflict = (task1: Task, task2: Task): boolean => {
  // Different days don't conflict
  if (!isSameDay(task1.date, task2.date)) return false;
  
  // If either task is missing time info, we can't determine overlap
  if (!task1.startTime || !task1.endTime || !task2.startTime || !task2.endTime) {
    return false;
  }
  
  // Convert times to comparable format (minutes since midnight)
  const getMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const task1Start = getMinutes(task1.startTime);
  const task1End = getMinutes(task1.endTime);
  const task2Start = getMinutes(task2.startTime);
  const task2End = getMinutes(task2.endTime);
  
  // Check for overlap
  return !(task1End <= task2Start || task1Start >= task2End);
};

/**
 * Detect conflicts for a specific task against a set of tasks
 */
export const detectConflicts = (task: Task, allTasks: Task[]): Task[] => {
  return allTasks.filter(t => 
    t.id !== task.id &&
    doSchedulesConflict(task, t) &&
    // Check if assigned to same person or crew
    ((t.assignedTo && t.assignedTo === task.assignedTo) || 
     (t.crewId && t.crewId === task.crewId))
  );
};

/**
 * Format time range for display
 */
export const formatTimeRange = (startTime?: string, endTime?: string): string => {
  if (!startTime) return '';
  
  return endTime ? `${startTime} - ${endTime}` : startTime;
};

/**
 * Get initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

/**
 * Get employee name from ID
 */
export const getEmployeeName = (employeeId: string, employees: Employee[]): string => {
  const employee = employees.find(emp => emp.id === employeeId);
  return employee?.name || '';
};

/**
 * Sort tasks by time and status
 */
export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by start time if available
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    
    // Put tasks with start time before those without
    if (a.startTime) return -1;
    if (b.startTime) return 1;
    
    // Finally sort by title
    return a.title.localeCompare(b.title);
  });
};

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

// Add the ClientLocationInfo interface to match the function above
export interface ClientLocationInfo {
  clientName: string;
  locationName: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
