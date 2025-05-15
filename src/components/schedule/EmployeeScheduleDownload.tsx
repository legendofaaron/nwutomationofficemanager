
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { FileText, FileDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Task } from './ScheduleTypes';
import { downloadScheduleAsPdf, downloadScheduleAsTxt, filterTasksByDateRange } from '@/utils/downloadUtils';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [useAllDates, setUseAllDates] = useState<boolean>(false);
  
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
    // Get tasks assigned to this employee
    const employeeTasks = allTasks.filter(task => {
      // Check if task is assigned to this employee
      const isAssignedToEmployee = task.assignedTo === employeeName;
      
      // Check if employee is part of a crew assigned to this task
      const isInAssignedCrew = task.crew?.includes(employeeName) || false;
      
      return (isAssignedToEmployee || isInAssignedCrew);
    });
    
    // If using all dates, return all employee tasks
    if (useAllDates) {
      return employeeTasks;
    }
    
    // Filter by date range if date filter is enabled
    return filterTasksByDateRange(employeeTasks, date?.from, date?.to);
  };

  const handleDownloadPdf = () => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast({
        title: "No tasks found",
        description: "No scheduled tasks found for this employee",
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
        description: "No scheduled tasks found for this employee",
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

  // Handle toggle switch change
  const handleToggleChange = (checked: boolean) => {
    setUseAllDates(checked);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Download Schedule</CardTitle>
        <CardDescription>
          Download {employeeName}'s schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Switch 
            id="useAllDates" 
            checked={useAllDates} 
            onCheckedChange={handleToggleChange} 
          />
          <Label htmlFor="useAllDates">Download complete employee schedule</Label>
        </div>

        {!useAllDates && (
          <div className="grid gap-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Select Date Range</label>
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
                    <FileText className="mr-2 h-4 w-4" />
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
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 w-full">
        <Button 
          variant="outline" 
          className="w-full gap-2 bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-700" 
          onClick={handleDownloadTxt}
        >
          <FileText className="h-5 w-5" />
          Download as TXT
        </Button>
        <Button 
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={handleDownloadPdf}
        >
          <FileDown className="h-5 w-5" />
          Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmployeeScheduleDownload;
