
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon, FileText, FileDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Task } from './ScheduleTypes';
import { downloadScheduleAsPdf, downloadScheduleAsTxt } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';

interface ScheduleDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const ScheduleDownloadDialog: React.FC<ScheduleDownloadDialogProps> = ({
  isOpen,
  onClose,
  tasks
}) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });

  // Filter tasks within selected date range
  const getFilteredTasks = (): Task[] => {
    if (!date?.from) return [];
    
    return tasks.filter(task => {
      // Check if task date is within the selected range
      const taskDate = new Date(task.date);
      const isInDateRange = date.from && taskDate >= date.from && 
                            (!date.to || taskDate <= date.to);
      
      return isInDateRange;
    });
  };

  const handleDownloadPdf = () => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast({
        variant: "destructive",
        title: "No tasks found",
        description: "No scheduled tasks in the selected date range"
      });
      return;
    }
    
    try {
      downloadScheduleAsPdf(filteredTasks, {
        type: 'all',
        name: 'Full Schedule'
      });
      toast({
        title: "Schedule downloaded",
        description: "Schedule has been downloaded as PDF"
      });
      onClose();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download schedule as PDF"
      });
    }
  };

  const handleDownloadTxt = () => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast({
        variant: "destructive",
        title: "No tasks found",
        description: "No scheduled tasks in the selected date range"
      });
      return;
    }
    
    try {
      downloadScheduleAsTxt(filteredTasks, {
        type: 'all',
        name: 'Full Schedule'
      });
      toast({
        title: "Schedule downloaded",
        description: "Schedule has been downloaded as TXT"
      });
      onClose();
    } catch (error) {
      console.error("Error downloading TXT:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download schedule as TXT"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download Schedule</DialogTitle>
          <DialogDescription>
            Select a date range to download your schedule
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
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
        </div>
        
        <div className="flex justify-between space-x-2">
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
            className="w-full gap-2" 
            onClick={handleDownloadPdf}
            disabled={!date?.from}
          >
            <FileDown className="h-4 w-4" />
            Download as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDownloadDialog;
