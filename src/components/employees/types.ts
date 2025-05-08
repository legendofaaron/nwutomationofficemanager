
import { Employee, Crew } from '../schedule/ScheduleTypes';

// Re-export the types for compatibility
export type { Employee, Crew };

export interface TaskForEmployeeView {
  id: string;
  text: string;
  title?: string;
  completed: boolean;
  date: Date;
  assignedTo?: string;
  assignedToAvatars?: string[];
  crew?: string[];
  crewId?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  clientId?: string;
  clientLocationId?: string;
}
