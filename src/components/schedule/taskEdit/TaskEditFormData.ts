
import { Task, TaskFormData, AssignmentType, LocationType } from '../ScheduleTypes';

// Helper to initialize form data from task
export const initializeFormData = (task: Task | null): TaskFormData => {
  if (!task) {
    return {
      title: '',
      assignedTo: '',
      assignedCrew: '',
      startTime: '',
      endTime: '',
      location: '',
      clientId: '',
      clientLocationId: ''
    };
  }
  
  return {
    title: task.title || '',
    assignedTo: task.assignedTo || '',
    assignedCrew: task.crewId || '',
    startTime: task.startTime || '',
    endTime: task.endTime || '',
    location: task.location || '',
    clientId: task.clientId || '',
    clientLocationId: task.clientLocationId || ''
  };
};

// Helper to determine initial assignment type from task
export const getInitialAssignmentType = (task: Task | null): AssignmentType => {
  if (!task) return 'individual';
  return (task.crew && task.crew.length > 0) ? 'crew' : 'individual';
};

// Helper to determine initial location type from task
export const getInitialLocationType = (task: Task | null): LocationType => {
  if (!task) return 'custom';
  return (task.clientId && task.clientLocationId) ? 'client' : 'custom';
};
