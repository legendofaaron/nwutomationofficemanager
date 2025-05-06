
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon, Download, FileText, FileDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Task } from './ScheduleTypes';
import { downloadScheduleAsPdf, downloadScheduleAsTxt } from '@/utils/downloadUtils';
import { toast } from 'sonner';

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

  // Filter tasks for this employee and within selected date range
  const getFilteredTasks = (): Task[] => {
    if (!date?.from) return [];
    
    return tasks.filter(task => {
      // Check if task is assigned to this employee
      const isAssignedToEmployee = task.assignedTo === employeeName;
      
      // Check if employee is part of a crew assigned to this task
      const isInAssignedCrew = task.crew?.includes(employeeName) || false;
      
      // Check if task date is within the selected range
      const taskDate = new Date(task.date);
      const isInDateRange = date.from && taskDate >= date.from && 
                            (!date.to || taskDate <= date.to);
      
      return (isAssignedToEmployee || isInAssignedCrew) && isInDateRange;
    });
  };

  const handleDownloadPdf = () => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast.error("No scheduled tasks in the selected date range");
      return;
    }
    
    try {
      downloadScheduleAsPdf(filteredTasks, {
        type: 'employee',
        id: employeeId,
        name: employeeName
      });
      toast.success(`Schedule for ${employeeName} downloaded as PDF`);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download schedule as PDF");
    }
  };

  const handleDownloadTxt = () => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast.error("No scheduled tasks in the selected date range");
      return;
    }
    
    try {
      downloadScheduleAsTxt(filteredTasks, {
        type: 'employee',
        id: employeeId,
        name: employeeName
      });
      toast.success(`Schedule for ${employeeName} downloaded as TXT`);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error downloading TXT:", error);
      toast.error("Failed to download schedule as TXT");
    }
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
                  onSelect={setDate}
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
