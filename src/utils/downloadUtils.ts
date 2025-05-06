
import jsPDF from 'jspdf';
import { Task } from '@/components/schedule/ScheduleTypes';
import { format } from 'date-fns';

// Helper to format a task for text display
const formatTaskForText = (task: Task): string => {
  const date = format(task.date, 'MMM dd, yyyy');
  const time = task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : 'All day';
  const status = task.completed ? '[✓]' : '[ ]';
  const assignee = task.assignedTo ? `Assigned to: ${task.assignedTo}` : 
                  task.crew ? `Crew: ${task.crew.join(', ')}` : 'Unassigned';
  const location = task.location ? `Location: ${task.location}` : '';
  
  return `${status} ${date} | ${time} | ${task.title}\n    ${assignee}\n    ${location}\n`;
};

// Generate a text version of the schedule
export const generateScheduleText = (tasks: Task[]): string => {
  // Sort tasks by date and time
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by date
    const dateComparison = a.date.getTime() - b.date.getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // Then sort by start time if dates are the same
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    return 0;
  });

  let text = "SCHEDULE\n";
  text += "========================================\n\n";
  
  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  
  sortedTasks.forEach(task => {
    const dateKey = format(task.date, 'yyyy-MM-dd');
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });
  
  // Generate text for each date group
  Object.keys(tasksByDate).sort().forEach(dateKey => {
    const tasksForDate = tasksByDate[dateKey];
    const dateHeader = format(tasksForDate[0].date, 'EEEE, MMMM d, yyyy');
    
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
export const generateSchedulePDF = (tasks: Task[]): jsPDF => {
  const pdf = new jsPDF();
  const sortedTasks = [...tasks].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // PDF styling
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Schedule", 20, 20);
  
  pdf.setLineWidth(0.5);
  pdf.line(20, 25, 190, 25);
  
  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  
  sortedTasks.forEach(task => {
    const dateKey = format(task.date, 'yyyy-MM-dd');
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });
  
  let yPosition = 35;
  const pageHeight = pdf.internal.pageSize.height;
  
  // Generate PDF content for each date group
  Object.keys(tasksByDate).sort().forEach(dateKey => {
    const tasksForDate = tasksByDate[dateKey];
    const dateHeader = format(tasksForDate[0].date, 'EEEE, MMMM d, yyyy');
    
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
      
      const time = task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : 'All day';
      const status = task.completed ? "✓ " : "□ ";
      
      pdf.setFont("helvetica", "bold");
      pdf.text(`${status}${time} | ${task.title}`, 20, yPosition);
      yPosition += 6;
      
      pdf.setFont("helvetica", "normal");
      
      // Assignee information
      const assignee = task.assignedTo ? `Assigned to: ${task.assignedTo}` : 
                      task.crew ? `Crew: ${task.crew.join(', ')}` : 'Unassigned';
      pdf.text(assignee, 25, yPosition);
      yPosition += 6;
      
      // Location information if available
      if (task.location) {
        pdf.text(`Location: ${task.location}`, 25, yPosition);
        yPosition += 6;
      }
      
      yPosition += 4; // Add extra space between tasks
    });
    
    yPosition += 6; // Add extra space between date groups
  });
  
  return pdf;
};

// Function to download text file
export const downloadScheduleAsTxt = (tasks: Task[]): void => {
  const text = generateScheduleText(tasks);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Create filename with current date
  const filename = `schedule_${format(new Date(), 'yyyy-MM-dd')}.txt`;
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to download PDF file
export const downloadScheduleAsPdf = (tasks: Task[]): void => {
  const pdf = generateSchedulePDF(tasks);
  
  // Create filename with current date
  const filename = `schedule_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  
  pdf.save(filename);
};
