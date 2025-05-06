import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ViewMode = 'welcome' | 'files' | 'database' | 'document' | 'knowledge' | 'office' | 'spreadsheet' | 'settings';
type FileType = 'folder' | 'document' | 'image' | 'spreadsheet';

interface File {
  id: string;
  name: string;
  type: FileType;
  children?: File[];
  content?: string;
  spreadsheetData?: SpreadsheetData;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  assignedTo?: string;
  assignedToAvatars?: string[];
  crew?: string[];
  location?: string;
  startTime?: string;
  endTime?: string;
}

interface SpreadsheetData {
  headers: string[];
  rows: Record<string, any>[];
}

interface DatabaseTable {
  id: string;
  name: string;
  columns: { name: string; type: string }[];
  rows: Record<string, any>[];
}

interface AssistantConfig {
  name: string;
  companyName?: string;
  companyDescription?: string;
  purpose?: string;
}

interface BrandingConfig {
  companyName: string;
  logoType: 'default' | 'text' | 'image';
  logoUrl?: string;
  primaryColor?: string;
}

interface Crew {
  id: string;
  name: string;
  members: string[];
}

interface Employee {
  id: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  crews?: string[];
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  locations?: ClientLocation[];
  notes?: string;
  contactPerson?: string;
  active: boolean;
}

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

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  currentFile: File | null;
  setCurrentFile: (file: File | null) => void;
  databaseTables: DatabaseTable[];
  currentTable: DatabaseTable | null;
  setCurrentTable: (table: DatabaseTable | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  aiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;
  assistantConfig: AssistantConfig;
  setAssistantConfig: (config: AssistantConfig) => void;
  branding: BrandingConfig;
  setBranding: (config: BrandingConfig) => void;
  // Calendar-related state
  calendarDate: Date;
  setCalendarDate: (date: Date) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  // Employee and crew management
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  crews: Crew[];
  setCrews: (crews: Crew[]) => void;
  // Client management
  clients: Client[];
  setClients: (clients: Client[]) => void;
  clientLocations: ClientLocation[];
  setClientLocations: (locations: ClientLocation[]) => void;
}

// Default todos with sample tasks
const defaultTodos: Todo[] = [
  { 
    id: '1', 
    text: 'Team meeting', 
    completed: false, 
    date: new Date(),
    location: 'Conference Room',
    startTime: '10:00',
    endTime: '11:00'
  },
  { 
    id: '2', 
    text: 'Review project proposal', 
    completed: true, 
    date: new Date(),
    assignedTo: 'John Smith'
  },
  { 
    id: '3', 
    text: 'Call with client', 
    completed: false, 
    date: new Date(),
    startTime: '14:30',
    endTime: '15:00'
  },
];

// Default employees
const defaultEmployees: Employee[] = [
  { id: '1', name: 'John Smith', position: 'Manager', email: 'john@example.com' },
  { id: '2', name: 'Sarah Johnson', position: 'Developer', email: 'sarah@example.com' },
  { id: '3', name: 'Michael Brown', position: 'Designer', email: 'michael@example.com' },
];

// Default crews
const defaultCrews: Crew[] = [
  { id: '1', name: 'Development Team', members: ['2', '3'] },
  { id: '2', name: 'Management', members: ['1'] },
];

// Default files with sample data
const defaultFiles: File[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'Project Proposal',
        type: 'document',
        content: '# Project Proposal\n\nThis is a sample project proposal document. You can edit it using the editor.'
      },
      {
        id: '3',
        name: 'Research Notes',
        type: 'document',
        content: '# Research Notes\n\n## Key Findings\n\n- Finding 1\n- Finding 2\n- Finding 3'
      }
    ]
  },
  {
    id: '4',
    name: 'Images',
    type: 'folder',
    children: [
      {
        id: '5',
        name: 'Screenshot.png',
        type: 'image'
      }
    ]
  },
  {
    id: '6',
    name: 'Spreadsheets',
    type: 'folder',
    children: [
      {
        id: '7',
        name: 'Sales Data.xlsx',
        type: 'spreadsheet',
        spreadsheetData: {
          headers: ['Product', 'Quantity', 'Price', 'Total'],
          rows: [
            { Product: 'Widget A', Quantity: 5, Price: 10, Total: 50 },
            { Product: 'Widget B', Quantity: 3, Price: 20, Total: 60 },
            { Product: 'Widget C', Quantity: 7, Price: 15, Total: 105 }
          ]
        }
      },
      {
        id: '8',
        name: 'Budget.xlsx',
        type: 'spreadsheet',
        spreadsheetData: {
          headers: ['Category', 'Allocated', 'Spent', 'Remaining'],
          rows: [
            { Category: 'Marketing', Allocated: 5000, Spent: 3500, Remaining: 1500 },
            { Category: 'Development', Allocated: 10000, Spent: 8500, Remaining: 1500 },
            { Category: 'Operations', Allocated: 7500, Spent: 6000, Remaining: 1500 }
          ]
        }
      }
    ]
  }
];

// Default database tables with sample data
const defaultDatabaseTables: DatabaseTable[] = [
  {
    id: '1',
    name: 'users',
    columns: [
      { name: 'id', type: 'integer' },
      { name: 'name', type: 'varchar' },
      { name: 'email', type: 'varchar' },
      { name: 'created_at', type: 'timestamp' }
    ],
    rows: [
      { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2023-04-15T10:30:00Z' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2023-04-16T08:45:00Z' }
    ]
  },
  {
    id: '2',
    name: 'documents',
    columns: [
      { name: 'id', type: 'integer' },
      { name: 'title', type: 'varchar' },
      { name: 'content', type: 'text' },
      { name: 'user_id', type: 'integer' },
      { name: 'created_at', type: 'timestamp' }
    ],
    rows: [
      { id: 1, title: 'Getting Started', content: 'Welcome to our application...', user_id: 1, created_at: '2023-04-17T14:20:00Z' },
      { id: 2, title: 'Advanced Techniques', content: 'This guide covers advanced usage...', user_id: 2, created_at: '2023-04-18T09:10:00Z' }
    ]
  }
];

// Default clients with sample data
const defaultClients: Client[] = [
  { 
    id: '1', 
    name: 'Acme Corporation', 
    email: 'contact@acme.com', 
    phone: '(555) 123-4567',
    address: '123 Business Ave, Suite 100',
    contactPerson: 'Jane Wilson',
    active: true
  },
  { 
    id: '2', 
    name: 'TechStart Solutions', 
    email: 'info@techstart.com', 
    phone: '(555) 987-6543',
    address: '456 Innovation Blvd',
    contactPerson: 'Robert Chen',
    active: true
  },
  { 
    id: '3', 
    name: 'Global Enterprises', 
    email: 'hello@globalent.com', 
    phone: '(555) 456-7890',
    address: '789 Corporate Dr',
    contactPerson: 'Maria Garcia',
    active: true
  }
];

// Default client locations with sample data
const defaultClientLocations: ClientLocation[] = [
  {
    id: '1',
    clientId: '1',
    name: 'Acme Headquarters',
    address: '123 Business Ave, Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    isPrimary: true
  },
  {
    id: '2',
    clientId: '1',
    name: 'Acme Warehouse',
    address: '567 Industrial Pkwy',
    city: 'Oakland',
    state: 'CA',
    zipCode: '94612',
    isPrimary: false
  },
  {
    id: '3',
    clientId: '2',
    name: 'TechStart Main Office',
    address: '456 Innovation Blvd',
    city: 'Palo Alto',
    state: 'CA',
    zipCode: '94301',
    isPrimary: true
  },
  {
    id: '4',
    clientId: '3',
    name: 'Global Enterprises HQ',
    address: '789 Corporate Dr',
    city: 'San Jose',
    state: 'CA',
    zipCode: '95110',
    isPrimary: true
  }
];

// Create the context with undefined as default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the AppProvider component as a proper React function component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [files, setFiles] = useState<File[]>(defaultFiles);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [databaseTables] = useState<DatabaseTable[]>(defaultDatabaseTables);
  const [currentTable, setCurrentTable] = useState<DatabaseTable | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [assistantConfig, setAssistantConfig] = useState<AssistantConfig>({
    name: 'Office Manager'
  });
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: 'Northwestern Automation',
    logoType: 'default'
  });
  
  // Add missing state variables
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  
  // Employee and crew management
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);
  const [crews, setCrews] = useState<Crew[]>(defaultCrews);
  
  // Client management
  const [clients, setClients] = useState<Client[]>(defaultClients);
  const [clientLocations, setClientLocations] = useState<ClientLocation[]>(defaultClientLocations);

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        files,
        setFiles,
        currentFile,
        setCurrentFile,
        databaseTables,
        currentTable,
        setCurrentTable,
        sidebarOpen,
        setSidebarOpen,
        aiAssistantOpen,
        setAiAssistantOpen,
        assistantConfig,
        setAssistantConfig,
        branding,
        setBranding,
        calendarDate,
        setCalendarDate,
        todos,
        setTodos,
        employees,
        setEmployees,
        crews,
        setCrews,
        clients,
        setClients,
        clientLocations,
        setClientLocations
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Create a hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
