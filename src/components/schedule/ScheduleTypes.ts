export interface Task {
  id: string;
  title: string;
  text?: string; // Add text property for compatibility
  date: Date;
  completed: boolean;
  assignedTo?: string;
  crew?: string[];
  crewId?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  clientId?: string;
  clientLocationId?: string;
  description?: string; // Add description property
}

export interface Employee {
  id: string;
  name: string;
}

export interface Crew {
  id: string;
  name: string;
  members: string[];
}

export interface Client {
  id: string;
  name: string;
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
