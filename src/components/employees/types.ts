
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

export type EmployeeData = Employee;

export interface Crew {
  id: string;
  name: string;
  members: string[];
}

export type CrewData = Crew;

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
