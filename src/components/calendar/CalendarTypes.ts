export interface Todo {
  id: string;
  text: string;
  title?: string;
  completed: boolean;
  date: Date;
  location?: string;
  startTime?: string;
  endTime?: string;
  assignedTo?: string;
  assignedToAvatar?: string;
  crewId?: string;
  crewName?: string;
  crewMembers?: string[];
}

export interface TaskFormValues {
  text: string;
  date?: Date;
  location?: string;
  startTime?: string;
  endTime?: string;
  assignedTo?: string;
  crewId?: string;
  clientId?: string;
  clientLocationId?: string;
  description?: string;
}

export interface DroppedItem {
  id: string;
  text: string;
  type: string;
  originalData?: any;
}
