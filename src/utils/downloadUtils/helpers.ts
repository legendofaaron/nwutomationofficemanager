
import { Task } from '@/components/schedule/ScheduleTypes';
import { format, isValid } from 'date-fns';

// Helper to ensure we have a valid date object
export const ensureValidDate = (dateInput: Date | string): Date => {
  if (dateInput instanceof Date && isValid(dateInput)) {
    return dateInput;
  }
  
  if (typeof dateInput === 'string') {
    try {
      const parsedDate = new Date(dateInput);
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    } catch (e) {
      console.error("Invalid date string:", dateInput);
    }
  }
  
  return new Date(); // Return current date as fallback
};

// Helper to format a task for text display
export const formatTaskForText = (task: Task): string => {
  const date = format(ensureValidDate(task.date), 'MMM dd, yyyy');
  const time = task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : 'All day';
  const status = task.completed ? '[✓]' : '[ ]';
  const assignee = task.assignedTo ? `Assigned to: ${task.assignedTo}` : 
                  task.crew ? `Crew: ${task.crew.join(', ')}` : 'Unassigned';
  const location = task.location ? `Location: ${task.location}` : '';
  
  return `${status} ${date} | ${time} | ${task.title}\n    ${assignee}\n    ${location}\n`;
};

// New utility functions for date range filtering
export const filterTasksByDateRange = (tasks: Task[], startDate?: Date, endDate?: Date): Task[] => {
  if (!startDate) return tasks;
  
  return tasks.filter(task => {
    const taskDate = new Date(task.date);
    if (endDate) {
      return taskDate >= startDate && taskDate <= endDate;
    }
    return taskDate >= startDate;
  });
};

// Utility to get employee tasks
export const getEmployeeTasks = (tasks: Task[], employeeName: string): Task[] => {
  return tasks.filter(task => 
    task.assignedTo === employeeName || 
    (task.crew && task.crew.includes(employeeName))
  );
};

// Utility to get crew tasks
export const getCrewTasks = (tasks: Task[], crewId: string): Task[] => {
  return tasks.filter(task => task.crewId === crewId);
};

// Utility to format date range into a readable string
export const formatDateRange = (startDate?: Date, endDate?: Date): string => {
  if (!startDate) return 'No date selected';
  
  if (endDate) {
    return `${format(startDate, 'MMM dd, yyyy')} to ${format(endDate, 'MMM dd, yyyy')}`;
  }
  
  return format(startDate, 'MMMM dd, yyyy');
};
