
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ViewMode = 'welcome' | 'files' | 'database' | 'document' | 'knowledge' | 'office' | 'spreadsheet';
type FileType = 'folder' | 'document' | 'image' | 'spreadsheet';

interface File {
  id: string;
  name: string;
  type: FileType;
  children?: File[];
  content?: string;
  spreadsheetData?: SpreadsheetData;
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
  defaultTheme?: 'office' | 'bible';
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
}

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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [files, setFiles] = useState<File[]>(defaultFiles);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [databaseTables] = useState<DatabaseTable[]>(defaultDatabaseTables);
  const [currentTable, setCurrentTable] = useState<DatabaseTable | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [assistantConfig, setAssistantConfig] = useState<AssistantConfig>({
    name: 'Office Manager',
    defaultTheme: 'office'
  });

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
        setAssistantConfig
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
