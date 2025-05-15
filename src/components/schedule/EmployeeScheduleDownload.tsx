
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon, FileText, FileDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Task } from './ScheduleTypes';
import { downloadScheduleAsPdf, downloadScheduleAsTxt, filterTasksByDateRange } from '@/utils/downloadUtils';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';

interface EmployeeScheduleDownloadProps {
  employeeId: string;
  employeeName: string;
  tasks?: Task[];
  onClose?: () => void;
}

const EmployeeScheduleDownload = ({ employeeId, employeeName, tasks = [], onClose }: EmployeeScheduleDownloadProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });
  
  // Use the global app context to get additional tasks
  const { todos } = useAppContext();

  // Convert todos to tasks format if they're assigned to this employee
  const todoTasks: Task[] = todos
    .filter(todo => todo.assignedTo === employeeName)
    .map(todo => ({
      id: todo.id,
      title: todo.text,
      description: '',
      date: todo.date || new Date(),
      completed: todo.completed || false,
      assignedTo: todo.assignedTo,
      crew: todo.crewMembers,
      crewId: todo.crewId,
      crewName: todo.crewName,
      startTime: todo.startTime || '09:00',
      endTime: todo.endTime || '10:00',
      location: todo.location
    }));

  // Combine provided tasks with todo tasks, avoiding duplicates
  const allTasks = [...tasks];
  todoTasks.forEach(todoTask => {
    if (!allTasks.some(t => t.id === todoTask.id)) {
      allTasks.push(todoTask);
    }
  });

  // Filter tasks for this employee and within selected date range
  const getFilteredTasks = (): Task[] => {
    if (!date?.from) return [];
    
    const employeeTasks = allTasks.filter(task => {
      // Check if task is assigned to this employee
      const isAssignedToEmployee = task.assignedTo === employeeName;
      
      // Check if employee is part of a crew assigned to this task
      const isInAssignedCrew = task.crew?.includes(employeeName) || false;
      
      return (isAssignedToEmployee || isInAssignedCrew);
    });
    
    // Filter by date range
    return filterTasksByDateRange(employeeTasks, date.from, date.to);
  };

  const handleDownloadPdf = () => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast({
        title: "No tasks found",
        description: "No scheduled tasks in the selected date range",
        variant: "destructive"
      });
      return;
    }
    
    try {
      downloadScheduleAsPdf(filteredTasks, {
        type: 'employee',
        id: employeeId,
        name: employeeName
      });
      toast({
        title: "Success",
        description: `Schedule for ${employeeName} downloaded as PDF`,
        variant: "success"
      });
      if (onClose) onClose();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download schedule as PDF",
        variant: "destructive"
      });
    }
  };

  const handleDownloadTxt = () => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast({
        title: "No tasks found",
        description: "No scheduled tasks in the selected date range",
        variant: "destructive"
      });
      return;
    }
    
    try {
      downloadScheduleAsTxt(filteredTasks, {
        type: 'employee',
        id: employeeId,
        name: employeeName
      });
      toast({
        title: "Success",
        description: `Schedule for ${employeeName} downloaded as TXT`,
        variant: "success"
      });
      if (onClose) onClose();
    } catch (error) {
      console.error("Error downloading TXT:", error);
      toast({
        title: "Error",
        description: "Failed to download schedule as TXT",
        variant: "destructive"
      });
    }
  };

  // Handle date range selection for the calendar
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDate(range);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Download Schedule</CardTitle>
        <CardDescription>
          Download {employeeName}'s schedule for a specific date range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          className="w-full gap-2" 
          onClick={handleDownloadTxt}
          disabled={!date?.from}
        >
          <FileText className="h-4 w-4" />
          Download as TXT
        </Button>
        <Button 
          className="w-full gap-2 ml-2" 
          onClick={handleDownloadPdf}
          disabled={!date?.from}
        >
          <FileDown className="h-4 w-4" />
          Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmployeeScheduleDownload;
