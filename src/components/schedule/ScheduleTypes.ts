export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  assignedTo?: string;
  crew?: string[];
  crewId?: string;
  crewName?: string; // Adding this missing property
  startTime?: string;
  endTime?: string;
  location?: string;
  clientId?: string;
  locationId?: string;
  clientLocationId?: string;
}

export interface Employee {
  id: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  crews?: string[];
}

export interface Crew {
  id: string;
  name: string;
  members: string[];
  lead?: string; // Adding this field to match usage in MockScheduleData
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  notes?: string;
  active?: boolean;
}

export interface ClientLocation {
  id: string;
  clientId: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isPrimary?: boolean;
  notes?: string; // Adding this field to match usage in MockScheduleData
}

export interface TaskFormData {
  title: string;
  assignedTo: string;
  assignedCrew: string;
  startTime: string;
  endTime: string;
  location: string;
  clientId: string;
  clientLocationId: string;
}

export type LocationType = 'custom' | 'client';
export type AssignmentType = 'individual' | 'crew';
export type FilterType = 'all' | 'employee' | 'crew' | 'client';

export interface ClientLocationInfo {
  clientName: string;
  locationName: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface ScheduleFilter {
  type: FilterType;
  id?: string;
  name?: string;
}

// Enhanced DragDrop Types
export type DraggableItemType = 'task' | 'employee' | 'crew' | 'client' | 'location' | 'booking' | 'todo';

export interface DragItem {
  id: string;
  type: DraggableItemType;
  sourceContainerId?: string;
  data: any;
}

export interface DroppableConfig {
  id: string;
  acceptTypes: DraggableItemType[];
  onDrop: (item: DragItem, dropData?: any) => void;
}

export interface DragStartEventData {
  item: DragItem;
  node: HTMLElement;
  clientX: number;
  clientY: number;
}

export interface DragEndEventData {
  item: DragItem;
  dropped: boolean;
  dropTarget?: string;
}

// Add missing interfaces for files that are using them
export interface DatabaseTable {
  id: string;
  name: string;
  columns: { name: string; type: string }[];
  rows: any[];
  data?: any[];
}

export interface FileItem {
  id: string;
  name: string;
  type: 'document' | 'spreadsheet' | 'folder';
  content?: string;
  spreadsheetData?: {
    headers: string[];
    rows: Record<string, any>[];
  };
  children?: FileItem[];
}

export interface Branding {
  companyName: string;
  logoType?: 'default' | 'text' | 'image';
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
}
