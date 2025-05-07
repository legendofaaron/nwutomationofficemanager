
// Types for calendar components
import { Crew } from '@/components/schedule/ScheduleTypes';

// Base Todo type with required fields
export interface TodoBase {
  id: string;
  text: string;
  title?: string;
  completed: boolean;
  date: Date | string;
}

// Extended Todo with optional fields
export interface Todo extends TodoBase {
  location?: string;
  startTime?: string;
  endTime?: string;
  assignedTo?: string;
  assignedToAvatar?: string;
  clientId?: string;
  clientLocationId?: string;
  description?: string;
  crewId?: string;
  crewName?: string;
  crewMembers?: string[];
}

// Form values for task creation
export interface TaskFormValues {
  text: string;
  date: Date;
  location: string;
  startTime: string;
  endTime: string;
  assignedTo?: string;
}

// Dropped item from external components
export interface DroppedItem {
  id: string;
  type: string; // 'employee', 'crew', 'invoice', 'booking', etc.
  text: string;
  originalData?: any;
}

// Props for DragDrop context
export interface DragDropContextProps {
  children: React.ReactNode;
}
