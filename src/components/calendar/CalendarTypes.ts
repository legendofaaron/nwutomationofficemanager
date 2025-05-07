
import { Crew } from '@/components/schedule/ScheduleTypes';

export interface TodoBase {
  id: string;
  text: string;
  completed: boolean;
  date: Date | string; // Allow for string dates that will be converted to Date objects
  assignedTo?: string;
  assignedToAvatars?: string[];
  crew?: string[];
  location?: string;
  startTime?: string;
  endTime?: string;
  clientId?: string;
  clientLocationId?: string;
  description?: string;
  crewId?: string;
  title?: string; // Make title optional to match AppContext.tsx Todo type
  crewName?: string; // Adding crewName property to fix the type issue
}

export interface Todo extends TodoBase {
  crewMembers?: string[];
  assignedToAvatar?: string;
}

// Define types for the different items that can be dropped
export interface DroppedItem {
  id: string;
  text: string;
  type: 'employee' | 'crew' | 'invoice' | 'booking' | 'todo';
  originalData?: any;
}

export interface TaskFormValues {
  text: string;
  date: Date;
  location?: string;
  startTime?: string;
  endTime?: string;
  assignedTo?: string;
}
