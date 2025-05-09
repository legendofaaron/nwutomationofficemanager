
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import DragDropProvider from '@/components/schedule/DragDropContext';
import { Employee, Crew, Client, ClientLocation, FileItem, DatabaseTable, Branding } from '@/components/schedule/ScheduleTypes';

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

// Define ViewMode type
export type ViewMode = 'welcome' | 'office' | 'knowledge' | 'document' | 'spreadsheet' | 'database' | 'files' | 'settings';

// Define AssistantConfig interface
interface AssistantConfig {
  name?: string;
  companyName?: string;
  companyDescription?: string;
  purpose?: string;
}

// Define the context interface
interface AppContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  calendarDate: Date;
  setCalendarDate: React.Dispatch<React.SetStateAction<Date>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  crews: Crew[];
  setCrews: React.Dispatch<React.SetStateAction<Crew[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  clientLocations: ClientLocation[];
  setClientLocations: React.Dispatch<React.SetStateAction<ClientLocation[]>>;
  
  // Additional properties needed by components
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  aiAssistantOpen: boolean;
  setAiAssistantOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assistantConfig: AssistantConfig;
  setAssistantConfig: React.Dispatch<React.SetStateAction<AssistantConfig>>;
  branding: Branding;
  setBranding: React.Dispatch<React.SetStateAction<Branding>>;
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  currentFile: FileItem | null;
  setCurrentFile: React.Dispatch<React.SetStateAction<FileItem | null>>;
  databaseTables: DatabaseTable[];
  setDatabaseTables: React.Dispatch<React.SetStateAction<DatabaseTable[]>>;
  currentTable: DatabaseTable | null;
  setCurrentTable: React.Dispatch<React.SetStateAction<DatabaseTable | null>>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for initial state
const mockEmployees: Employee[] = [
  { id: '1', name: 'John Smith', position: 'Manager', email: 'john@example.com', phone: '555-123-4567' },
  { id: '2', name: 'Sarah Johnson', position: 'Developer', email: 'sarah@example.com', phone: '555-234-5678' },
  { id: '3', name: 'Michael Brown', position: 'Designer', email: 'michael@example.com', phone: '555-345-6789' },
  { id: '4', name: 'Emily Davis', position: 'QA Engineer', email: 'emily@example.com', phone: '555-456-7890' },
];

const mockCrews: Crew[] = [
  { id: '1', name: 'Development Team', members: ['1', '2'] },
  { id: '2', name: 'Design Team', members: ['3', '4'] },
];

const mockClients: Client[] = [
  { id: '1', name: 'Acme Corp', email: 'info@acme.com', phone: '555-111-2222', contactPerson: 'John Acme', active: true },
  { id: '2', name: 'Globex Inc', email: 'contact@globex.com', phone: '555-333-4444', contactPerson: 'Jane Globex', active: true },
];

const mockClientLocations: ClientLocation[] = [
  { id: '1', clientId: '1', name: 'Headquarters', address: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', isPrimary: true },
  { id: '2', clientId: '1', name: 'Branch Office', address: '456 Oak Ave', city: 'Boston', state: 'MA', zipCode: '02108' },
  { id: '3', clientId: '2', name: 'Main Office', address: '789 Pine St', city: 'San Francisco', state: 'CA', zipCode: '94102', isPrimary: true },
];

const mockDatabaseTables: DatabaseTable[] = [
  { 
    id: 'table1', 
    name: 'Customers',
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'name', type: 'text' },
      { name: 'email', type: 'text' }
    ],
    rows: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  },
  { 
    id: 'table2', 
    name: 'Orders', 
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'customer_id', type: 'uuid' },
      { name: 'total', type: 'numeric' }
    ],
    rows: [
      { id: '1', customer_id: '1', total: 99.99 },
      { id: '2', customer_id: '2', total: 149.99 }
    ]
  },
  { 
    id: 'table3', 
    name: 'Products',
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'name', type: 'text' },
      { name: 'price', type: 'numeric' }
    ],
    rows: [
      { id: '1', name: 'Widget', price: 19.99 },
      { id: '2', name: 'Gadget', price: 29.99 }
    ]
  }
];

const mockFiles: FileItem[] = [
  { 
    id: 'folder1', 
    name: 'Documents', 
    type: 'folder',
    children: [
      { id: 'doc1', name: 'Annual Report', type: 'document', content: '# Annual Report\n\nThis is the annual report content.' }
    ]
  },
  { 
    id: 'doc2', 
    name: 'Meeting Notes', 
    type: 'document', 
    content: '# Meeting Notes\n\nNotes from the last meeting.' 
  },
  {
    id: 'spreadsheet1',
    name: 'Budget',
    type: 'spreadsheet',
    spreadsheetData: {
      headers: ['Category', 'Amount', 'Notes'],
      rows: [
        { Category: 'Rent', Amount: '1500', Notes: 'Monthly' },
        { Category: 'Utilities', Amount: '200', Notes: 'Average' }
      ]
    }
  }
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
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [crews, setCrews] = useState<Crew[]>(mockCrews);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [clientLocations, setClientLocations] = useState<ClientLocation[]>(mockClientLocations);

  // Additional state values needed by components
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);
  const [assistantConfig, setAssistantConfig] = useState<AssistantConfig>({ name: 'Office Assistant', companyName: 'Your Company' });
  const [branding, setBranding] = useState<Branding>({ 
    companyName: 'Your Company',
    logoType: 'default',
    primaryColor: '#1E90FF',
    accentColor: '#0066CC'
  });
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [databaseTables, setDatabaseTables] = useState<DatabaseTable[]>(mockDatabaseTables);
  const [currentTable, setCurrentTable] = useState<DatabaseTable | null>(null);

  // Context value
  const value = {
    todos,
    setTodos,
    calendarDate,
    setCalendarDate,
    employees,
    setEmployees,
    crews,
    setCrews,
    clients,
    setClients,
    clientLocations,
    setClientLocations,
    viewMode,
    setViewMode,
    sidebarOpen,
    setSidebarOpen,
    aiAssistantOpen,
    setAiAssistantOpen,
    assistantConfig,
    setAssistantConfig,
    branding,
    setBranding,
    files,
    setFiles,
    currentFile,
    setCurrentFile,
    databaseTables,
    setDatabaseTables,
    currentTable,
    setCurrentTable
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
