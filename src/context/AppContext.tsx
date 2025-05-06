
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import DragDropProvider from '@/components/schedule/DragDropContext';

// Define Todo interface
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  assignedTo?: string;
  crew?: string[];
  location?: string;
  startTime?: string;
  endTime?: string;
}

// Define Employee interface
interface Employee {
  id: string;
  name: string;
  position?: string;
}

// Define Crew interface
interface Crew {
  id: string;
  name: string;
  members: string[];
}

// Define Client interface
interface Client {
  id: string;
  name: string;
}

// Define ClientLocation interface
interface ClientLocation {
  id: string;
  clientId: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isPrimary?: boolean;
}

// Define the context interface
interface AppContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  calendarDate: Date;
  setCalendarDate: React.Dispatch<React.SetStateAction<Date>>;
  employees: Employee[];
  crews: Crew[];
  clients: Client[];
  clientLocations: ClientLocation[];
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for initial state
const mockEmployees: Employee[] = [
  { id: '1', name: 'John Smith', position: 'Manager' },
  { id: '2', name: 'Sarah Johnson', position: 'Developer' },
  { id: '3', name: 'Michael Brown', position: 'Designer' },
  { id: '4', name: 'Emily Davis', position: 'QA Engineer' },
];

const mockCrews: Crew[] = [
  { id: '1', name: 'Development Team', members: ['1', '2'] },
  { id: '2', name: 'Design Team', members: ['3', '4'] },
];

const mockClients: Client[] = [
  { id: '1', name: 'Acme Corp' },
  { id: '2', name: 'Globex Inc' },
];

const mockClientLocations: ClientLocation[] = [
  { id: '1', clientId: '1', name: 'Headquarters', address: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', isPrimary: true },
  { id: '2', clientId: '1', name: 'Branch Office', address: '456 Oak Ave', city: 'Boston', state: 'MA', zipCode: '02108' },
  { id: '3', clientId: '2', name: 'Main Office', address: '789 Pine St', city: 'San Francisco', state: 'CA', zipCode: '94102', isPrimary: true },
];

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      text: 'Complete project proposal',
      completed: false,
      date: new Date()
    },
    {
      id: '2',
      text: 'Review candidate resumes',
      completed: true,
      date: new Date()
    },
    {
      id: '3',
      text: 'Prepare client presentation',
      completed: false,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
    },
  ]);
  
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  
  // Provide employees, crews, clients and locations from mock data
  const [employees] = useState<Employee[]>(mockEmployees);
  const [crews] = useState<Crew[]>(mockCrews);
  const [clients] = useState<Client[]>(mockClients);
  const [clientLocations] = useState<ClientLocation[]>(mockClientLocations);

  // Context value
  const value = {
    todos,
    setTodos,
    calendarDate,
    setCalendarDate,
    employees,
    crews,
    clients,
    clientLocations
  };

  return (
    <AppContext.Provider value={value}>
      <DragDropProvider>
        {children}
      </DragDropProvider>
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
