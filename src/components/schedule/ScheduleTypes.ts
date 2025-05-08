
export interface Task {
  id: string;
  title: string;
  text?: string; // Ensuring text property exists for compatibility
  date: Date;
  completed: boolean;
  assignedTo?: string;
  crew?: string[];
  crewId?: string;
  crewName?: string; // Adding crewName property
  startTime?: string;
  endTime?: string;
  location?: string;
  clientId?: string;
  clientLocationId?: string;
  description?: string; // Ensuring description property exists
}

export interface Employee {
  id: string;
  name: string;
  position?: string;
  role?: string;
  email?: string;
  phone?: string;
  crews?: string[];
  avatarUrl?: string;
}

export interface Crew {
  id: string;
  name: string;
  members: string[];
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  tags?: string[];
  status?: 'active' | 'inactive' | 'pending';
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
  description?: string;
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
