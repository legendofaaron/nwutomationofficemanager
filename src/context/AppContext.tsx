import React, { createContext, useContext, useState, ReactNode } from 'react';

type ViewMode = 'files' | 'database' | 'document' | 'knowledge';
type FileType = 'folder' | 'document' | 'image';

interface File {
  id: string;
  name: string;
  type: FileType;
  children?: File[];
  content?: string;
}

interface DatabaseTable {
  id: string;
  name: string;
  columns: { name: string; type: string }[];
  rows: Record<string, any>[];
}

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  files: File[];
  currentFile: File | null;
  setCurrentFile: (file: File | null) => void;
  databaseTables: DatabaseTable[];
  currentTable: DatabaseTable | null;
  setCurrentTable: (table: DatabaseTable | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  aiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;
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
  const [viewMode, setViewMode] = useState<ViewMode>('files');
  const [files] = useState<File[]>(defaultFiles);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [databaseTables] = useState<DatabaseTable[]>(defaultDatabaseTables);
  const [currentTable, setCurrentTable] = useState<DatabaseTable | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        files,
        currentFile,
        setCurrentFile,
        databaseTables,
        currentTable,
        setCurrentTable,
        sidebarOpen,
        setSidebarOpen,
        aiAssistantOpen,
        setAiAssistantOpen
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
