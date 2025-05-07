
import jsPDF from 'jspdf';
import { Task, ScheduleFilter } from '@/components/schedule/ScheduleTypes';
import { format } from 'date-fns';
import { ensureValidDate } from './helpers';

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
      filteredTasks = tasks.filter(task => task.crewId === filter.id);
    } else if (filter.type === 'client') {
      filteredTasks = tasks.filter(task => task.clientId === filter.id);
    }
  }
  
  const sortedTasks = filteredTasks.sort((a, b) => {
    const aDate = ensureValidDate(a.date);
    const bDate = ensureValidDate(b.date);
    return aDate.getTime() - bDate.getTime();
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
    const dateKey = format(ensureValidDate(task.date), 'yyyy-MM-dd');
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });
  
  let yPosition = filter && filter.type !== 'all' ? 45 : 35;
  const pageHeight = pdf.internal.pageSize.height;
  
  // Check if we have any tasks
  if (Object.keys(tasksByDate).length === 0) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text("No tasks scheduled for the selected criteria.", 20, yPosition);
    return pdf;
  }
  
  // Generate PDF content for each date group
  Object.keys(tasksByDate).sort().forEach(dateKey => {
    const tasksForDate = tasksByDate[dateKey];
    if (tasksForDate.length === 0) return;
    
    const dateHeader = format(ensureValidDate(tasksForDate[0].date), 'EEEE, MMMM d, yyyy');
    
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

// Function to download PDF file
export const downloadScheduleAsPdf = (tasks: Task[], filter?: ScheduleFilter): void => {
  const pdf = generateSchedulePDF(tasks, filter);
  
  // Create filename with current date and filter info
  let filename = `schedule_${format(new Date(), 'yyyy-MM-dd')}`;
  if (filter && filter.type !== 'all' && filter.name) {
    filename += `_${filter.type}_${filter.name.replace(/\s+/g, '_')}`;
  }
  filename += '.pdf';
  
  pdf.save(filename);
};
