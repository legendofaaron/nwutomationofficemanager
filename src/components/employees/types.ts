
export interface Employee {
  id: string;
  name: string;
  position?: string;
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

export interface TaskForEmployeeView {
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
}
