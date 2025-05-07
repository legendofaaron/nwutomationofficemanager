
import { Crew } from '@/components/schedule/ScheduleTypes';

export interface TodoBase {
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
  clientId?: string;
  clientLocationId?: string;
  description?: string;
  crewId?: string;
}

export interface Todo extends TodoBase {
  title: string; // Ensure title is required
  crewName?: string; // Add missing property
  crewMembers?: string[];
  assignedToAvatar?: string; // Add missing property
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
