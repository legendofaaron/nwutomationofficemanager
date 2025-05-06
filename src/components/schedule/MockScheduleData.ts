
import { addDays, subDays } from 'date-fns';
import { Task, Employee, Crew, Client, ClientLocation } from './ScheduleTypes';

// Generate mock employees
export const generateMockEmployees = (): Employee[] => {
  return [
    { id: 'emp-1', name: 'John Smith', role: 'Technician', phone: '555-1234', email: 'john@example.com' },
    { id: 'emp-2', name: 'Sarah Johnson', role: 'Lead Technician', phone: '555-2345', email: 'sarah@example.com' },
    { id: 'emp-3', name: 'Mike Davis', role: 'Installer', phone: '555-3456', email: 'mike@example.com' },
    { id: 'emp-4', name: 'Emily Brown', role: 'Senior Technician', phone: '555-4567', email: 'emily@example.com' },
    { id: 'emp-5', name: 'David Wilson', role: 'Apprentice', phone: '555-5678', email: 'david@example.com' },
  ];
};

// Generate mock crews
export const generateMockCrews = (employees: Employee[]): Crew[] => {
  return [
    { 
      id: 'crew-1', 
      name: 'Installation Team Alpha', 
      memberIds: ['emp-1', 'emp-2', 'emp-5'],
      lead: 'emp-2' 
    },
    { 
      id: 'crew-2', 
      name: 'Maintenance Crew', 
      memberIds: ['emp-3', 'emp-4'],
      lead: 'emp-4' 
    },
  ];
};

// Generate mock clients
export const generateMockClients = (): Client[] => {
  return [
    { id: 'client-1', name: 'Acme Corporation', phone: '555-9876', email: 'info@acme.com' },
    { id: 'client-2', name: 'Global Industries', phone: '555-8765', email: 'contact@globalindustries.com' },
    { id: 'client-3', name: 'Sunrise Properties', phone: '555-7654', email: 'hello@sunriseproperties.com' },
  ];
};

// Generate mock client locations
export const generateMockClientLocations = (clients: Client[]): ClientLocation[] => {
  return [
    { 
      id: 'loc-1', 
      clientId: 'client-1',
      name: 'Downtown Office', 
      address: '123 Main St, Anytown, CA 12345',
      notes: 'Park in visitor parking' 
    },
    { 
      id: 'loc-2', 
      clientId: 'client-1',
      name: 'Warehouse', 
      address: '456 Industrial Ave, Anytown, CA 12345',
      notes: 'Check in at security gate' 
    },
    { 
      id: 'loc-3', 
      clientId: 'client-2',
      name: 'Headquarters', 
      address: '789 Corporate Blvd, Othertown, CA 67890',
      notes: 'Suite 400, 4th floor' 
    },
    { 
      id: 'loc-4', 
      clientId: 'client-3',
      name: 'Apartment Complex', 
      address: '101 Residential Lane, Somewhere, CA 54321',
      notes: 'Enter through management office' 
    },
  ];
};

// Generate mock tasks
export const generateMockTasks = (
  employees: Employee[], 
  crews: Crew[], 
  clients: Client[], 
  locations: ClientLocation[]
): Task[] => {
  const today = new Date();
  
  return [
    {
      id: 'task-1',
      title: 'HVAC Installation',
      description: 'Install new air conditioning system',
      date: today,
      startTime: '09:00',
      endTime: '12:00',
      completed: false,
      crewId: 'crew-1',
      clientId: 'client-1',
      locationId: 'loc-1'
    },
    {
      id: 'task-2',
      title: 'Regular Maintenance',
      description: 'Quarterly system check and filter replacement',
      date: today,
      startTime: '13:00',
      endTime: '15:00',
      completed: true,
      assignedTo: 'emp-3',
      clientId: 'client-2',
      locationId: 'loc-3'
    },
    {
      id: 'task-3',
      title: 'Repair Request',
      description: 'Fix leaking pipe in bathroom',
      date: addDays(today, 1),
      startTime: '10:00',
      endTime: '11:30',
      completed: false,
      assignedTo: 'emp-4',
      clientId: 'client-3',
      locationId: 'loc-4'
    },
    {
      id: 'task-4',
      title: 'System Upgrade',
      description: 'Upgrade electrical panel',
      date: addDays(today, 2),
      startTime: '09:00',
      endTime: '16:00',
      completed: false,
      crewId: 'crew-2',
      clientId: 'client-1',
      locationId: 'loc-2'
    },
    {
      id: 'task-5',
      title: 'Inspection',
      description: 'Annual safety inspection',
      date: subDays(today, 1),
      startTime: '14:00',
      endTime: '16:00',
      completed: true,
      assignedTo: 'emp-1',
      clientId: 'client-2',
      locationId: 'loc-3'
    },
  ];
};
