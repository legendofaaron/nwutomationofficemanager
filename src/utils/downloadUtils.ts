
import jsPDF from 'jspdf';
import { Task, ScheduleFilter } from '@/components/schedule/ScheduleTypes';
import { format } from 'date-fns';

// Helper to format a task for text display
const formatTaskForText = (task: Task): string => {
  const dateStr = task.date instanceof Date ? task.date : new Date(task.date);
  const date = format(dateStr, 'MMM dd, yyyy');
  const time = task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : 'All day';
  const status = task.completed ? '[✓]' : '[ ]';
  const assignee = task.assignedTo ? `Assigned to: ${task.assignedTo}` : 
                  task.crew && task.crew.length > 0 ? `Crew: ${task.crew.join(', ')}` : 'Unassigned';
  const location = task.location ? `Location: ${task.location}` : '';
  
  return `${status} ${date} | ${time} | ${task.title || task.text || "Untitled Task"}\n    ${assignee}\n    ${location}\n`;
};

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
      filteredTasks = tasks.filter(task => 
        task.crewId === filter.id || 
        (task.crew && task.crew.includes(filter.id))
      );
    } else if (filter.type === 'client') {
      filteredTasks = tasks.filter(task => task.clientId === filter.id);
    }
  }

  // Sort tasks by date and time
  const sortedTasks = filteredTasks.sort((a, b) => {
    // Ensure both dates are Date objects
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    
    // First sort by date
    const dateComparison = dateA.getTime() - dateB.getTime();
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
    const taskDate = task.date instanceof Date ? task.date : new Date(task.date);
    const dateKey = format(taskDate, 'yyyy-MM-dd');
    
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });
  
  // Generate text for each date group
  Object.keys(tasksByDate).sort().forEach(dateKey => {
    const tasksForDate = tasksByDate[dateKey];
    const firstTaskDate = tasksForDate[0].date instanceof Date ? 
      tasksForDate[0].date : new Date(tasksForDate[0].date);
    const dateHeader = format(firstTaskDate, 'EEEE, MMMM d, yyyy');
    
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

// Generate a PDF version of the schedule
export const generateSchedulePDF = (tasks: Task[], filter?: ScheduleFilter): jsPDF => {
  const pdf = new jsPDF();
  
  // Filter tasks based on the current filter
  let filteredTasks = [...tasks];
  if (filter && filter.type !== 'all' && filter.id) {
    if (filter.type === 'employee') {
      filteredTasks = tasks.filter(task => 
        task.assignedTo === filter.name || 
        (task.crew && task.crew.includes(filter.name || ''))
      );
    } else if (filter.type === 'crew') {
      filteredTasks = tasks.filter(task => 
        task.crewId === filter.id || 
        (task.crew && task.crew.includes(filter.id))
      );
    } else if (filter.type === 'client') {
      filteredTasks = tasks.filter(task => task.clientId === filter.id);
    }
  }
  
  // Sort tasks by date
  const sortedTasks = filteredTasks.sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  // PDF styling
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Schedule", 20, 20);
  
  // Add filter information
  if (filter && filter.type !== 'all' && filter.name) {
    pdf.setFontSize(14);
    pdf.text(`${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}: ${filter.name}`, 20, 30);
  }
  
  pdf.setLineWidth(0.5);
  pdf.line(20, filter && filter.type !== 'all' ? 35 : 25, 190, filter && filter.type !== 'all' ? 35 : 25);
  
  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  
  sortedTasks.forEach(task => {
    const taskDate = task.date instanceof Date ? task.date : new Date(task.date);
    const dateKey = format(taskDate, 'yyyy-MM-dd');
    
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });
  
  let yPosition = filter && filter.type !== 'all' ? 45 : 35;
  const pageHeight = pdf.internal.pageSize.height;
  
  // Generate PDF content for each date group
  Object.keys(tasksByDate).sort().forEach(dateKey => {
    const tasksForDate = tasksByDate[dateKey];
    const firstTaskDate = tasksForDate[0].date instanceof Date ? 
      tasksForDate[0].date : new Date(tasksForDate[0].date);
    const dateHeader = format(firstTaskDate, 'EEEE, MMMM d, yyyy');
    
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Date header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(dateHeader, 20, yPosition);
    yPosition += 8;
    
    // Tasks for this date
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    
    tasksForDate.forEach(task => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Define the variables needed for task information
      const time = task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : 'All day';
      const status = task.completed ? "✓ " : "□ ";
      
      // Make sure to use both title and text properties for backwards compatibility
      const title = task.title || task.text || "Untitled Task";
      
      pdf.setFont("helvetica", "bold");
      pdf.text(`${status}${time} | ${title}`, 20, yPosition);
      yPosition += 6;
      
      pdf.setFont("helvetica", "normal");
      
      // Assignee information
      const assignee = task.assignedTo ? `Assigned to: ${task.assignedTo}` : 
                      task.crew && task.crew.length > 0 ? `Crew: ${task.crew.join(', ')}` : 'Unassigned';
      pdf.text(assignee, 25, yPosition);
      yPosition += 6;
      
      // Location information if available
      if (task.location) {
        pdf.text(`Location: ${task.location}`, 25, yPosition);
        yPosition += 6;
      }
      
      // Add task description if available
      if (task.description) {
        const descLines = pdf.splitTextToSize(task.description, 160);
        pdf.text(descLines, 25, yPosition);
        yPosition += 6 * descLines.length;
      }
      
      yPosition += 4; // Add extra space between tasks
    });
    
    yPosition += 6; // Add extra space between date groups
  });
  
  return pdf;
};

// Function to download text file
export const downloadScheduleAsTxt = (tasks: Task[], filter?: ScheduleFilter): void => {
  // Make sure we have tasks
  if (!tasks || tasks.length === 0) {
    console.error("No tasks provided to downloadScheduleAsTxt");
    return;
  }
  
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

// Function to download PDF file
export const downloadScheduleAsPdf = (tasks: Task[], filter?: ScheduleFilter): void => {
  // Make sure we have tasks
  if (!tasks || tasks.length === 0) {
    console.error("No tasks provided to downloadScheduleAsPdf");
    return;
  }
  
  const pdf = generateSchedulePDF(tasks, filter);
  
  // Create filename with current date and filter info
  let filename = `schedule_${format(new Date(), 'yyyy-MM-dd')}`;
  if (filter && filter.type !== 'all' && filter.name) {
    filename += `_${filter.type}_${filter.name.replace(/\s+/g, '_')}`;
  }
  filename += '.pdf';
  
  pdf.save(filename);
};

// Now update the function in EmployeesView to convert todos to tasks properly
export const convertTodosToTasks = (todos: any[]): Task[] => {
  return todos.map(todo => ({
    id: todo.id,
    title: todo.text || todo.title || "Untitled Task", // Support both text and title properties
    text: todo.text || todo.title, // Include text property for backward compatibility
    date: todo.date instanceof Date ? todo.date : new Date(todo.date || new Date()),
    completed: !!todo.completed,
    assignedTo: todo.assignedTo,
    crewId: todo.crewId || (todo.crew && todo.crew[0]), // Use crewId or first item in crew array
    crew: todo.crew || [],
    startTime: todo.startTime,
    endTime: todo.endTime,
    location: todo.location,
    clientId: todo.clientId || undefined,
    clientLocationId: todo.clientLocationId || undefined,
    description: todo.description || ""
  }));
};

// Utility to filter tasks by date range
export const filterTasksByDateRange = (tasks: Task[], startDate?: Date, endDate?: Date): Task[] => {
  if (!startDate) return tasks;
  
  return tasks.filter(task => {
    const taskDate = task.date instanceof Date ? task.date : new Date(task.date);
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
  return tasks.filter(task => 
    task.crewId === crewId || 
    (task.crew && task.crew.includes(crewId))
  );
};

// Utility to format date range into a readable string
export const formatDateRange = (startDate?: Date, endDate?: Date): string => {
  if (!startDate) return 'No date selected';
  
  if (endDate) {
    return `${format(startDate, 'MMM dd, yyyy')} to ${format(endDate, 'MMM dd, yyyy')}`;
  }
  
  return format(startDate, 'MMMM dd, yyyy');
};
