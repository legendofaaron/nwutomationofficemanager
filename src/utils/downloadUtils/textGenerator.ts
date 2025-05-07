
import { Task, ScheduleFilter } from '@/components/schedule/ScheduleTypes';
import { format } from 'date-fns';
import { ensureValidDate, formatTaskForText } from './helpers';

// Generate a text version of the schedule
export const generateScheduleText = (tasks: Task[], filter?: ScheduleFilter): string => {
  // Filter tasks based on the current filter
  let filteredTasks = [...tasks];
  if (filter && filter.type !== 'all' && filter.id) {
    if (filter.type === 'employee') {
      filteredTasks = tasks.filter(task => 
        task.assignedTo === filter.name || 
        (task.crew && task.crew.includes(filter.name || ''))
      );
    } else if (filter.type === 'crew') {
      filteredTasks = tasks.filter(task => task.crewId === filter.id);
    } else if (filter.type === 'client') {
      filteredTasks = tasks.filter(task => task.clientId === filter.id);
    }
  }

  // Sort tasks by date and time
  const sortedTasks = filteredTasks.sort((a, b) => {
    // First sort by date
    const aDate = ensureValidDate(a.date);
    const bDate = ensureValidDate(b.date);
    const dateComparison = aDate.getTime() - bDate.getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // Then sort by start time if dates are the same
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    return 0;
  });

  let text = "SCHEDULE\n";
  
  // Add filter information
  if (filter && filter.type !== 'all' && filter.name) {
    text += `${filter.type.toUpperCase()}: ${filter.name}\n`;
  }
  
  text += "========================================\n\n";
  
  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  
  sortedTasks.forEach(task => {
    const dateKey = format(ensureValidDate(task.date), 'yyyy-MM-dd');
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });
  
  // Generate text for each date group
  Object.keys(tasksByDate).sort().forEach(dateKey => {
    const tasksForDate = tasksByDate[dateKey];
    if (tasksForDate.length === 0) return;
    
    const dateHeader = format(ensureValidDate(tasksForDate[0].date), 'EEEE, MMMM d, yyyy');
    
    text += `${dateHeader}\n`;
    text += "----------------------------------------\n";
    
    tasksForDate.forEach(task => {
      text += formatTaskForText(task);
      text += "\n";
    });
    
    text += "\n";
  });
  
  return text;
};

// Function to download text file
export const downloadScheduleAsTxt = (tasks: Task[], filter?: ScheduleFilter): void => {
  const text = generateScheduleText(tasks, filter);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Create filename with current date and filter info
  let filename = `schedule_${format(new Date(), 'yyyy-MM-dd')}`;
  if (filter && filter.type !== 'all' && filter.name) {
    filename += `_${filter.type}_${filter.name.replace(/\s+/g, '_')}`;
  }
  filename += '.txt';
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
