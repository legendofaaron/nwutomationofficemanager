
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval, startOfDay } from 'date-fns';
import { CalendarIcon, FileText, FileDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Crew, Task } from './ScheduleTypes';
import { downloadScheduleAsPdf, downloadScheduleAsTxt } from '@/utils/downloadUtils';
import { toast } from 'sonner';

interface CrewScheduleDownloadProps {
  crews: Crew[];
  tasks?: Task[];
  selectedCrewId?: string | null;
  onClose?: () => void;
}

const CrewScheduleDownload = ({ crews, tasks = [], selectedCrewId, onClose }: CrewScheduleDownloadProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });
  
  const [selectedCrew, setSelectedCrew] = useState<string | null>(selectedCrewId || null);
  
  // Filter tasks for selected crew and within selected date range
  const getFilteredTasks = (): Task[] => {
    if (!selectedCrew) return [];
    
    return tasks.filter(task => {
      // Check if task is assigned to this crew
      const isAssignedToCrew = task.crewId === selectedCrew;
      
      if (!isAssignedToCrew) return false;
      
      // Handle date filtering
      if (!date?.from) return true;
      
      // Ensure task.date is a Date object
      let taskDate = task.date;
      if (!(taskDate instanceof Date)) {
        try {
          taskDate = new Date(taskDate);
        } catch (e) {
          console.error("Invalid date format:", taskDate);
          return false;
        }
      }
      
      const start = startOfDay(date.from);
      
      // If no end date, check if task is on or after start date
      if (!date.to) {
        return taskDate >= start;
      }
      
      // Check if task date is within range
      const end = startOfDay(date.to);
      return taskDate >= start && taskDate <= end;
    });
  };
  
  // Get crew name by ID
  const getCrewNameById = (crewId: string): string => {
    const crew = crews.find(c => c.id === crewId);
    return crew ? crew.name : "Unknown Crew";
  };

  const handleDownloadPdf = () => {
    if (!selectedCrew) {
      toast.error("Please select a crew first");
      return;
    }
    
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast.error("No scheduled tasks in the selected date range for this crew");
      return;
    }
    
    try {
      downloadScheduleAsPdf(filteredTasks, {
        type: 'crew',
        id: selectedCrew,
        name: getCrewNameById(selectedCrew)
      });
      toast.success(`Schedule for ${getCrewNameById(selectedCrew)} downloaded as PDF`);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download schedule as PDF");
    }
  };

  const handleDownloadTxt = () => {
    if (!selectedCrew) {
      toast.error("Please select a crew first");
      return;
    }
    
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast.error("No scheduled tasks in the selected date range for this crew");
      return;
    }
    
    try {
      downloadScheduleAsTxt(filteredTasks, {
        type: 'crew',
        id: selectedCrew,
        name: getCrewNameById(selectedCrew)
      });
      toast.success(`Schedule for ${getCrewNameById(selectedCrew)} downloaded as TXT`);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error downloading TXT:", error);
      toast.error("Failed to download schedule as TXT");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Download Crew Schedule</CardTitle>
        <CardDescription>
          Download a crew's schedule for a specific date range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Select Crew</label>
            <Select 
              value={selectedCrew || ''} 
              onValueChange={(value) => setSelectedCrew(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a crew" />
              </SelectTrigger>
              <SelectContent>
                {crews.map(crew => (
                  <SelectItem key={crew.id} value={crew.id}>
                    {crew.name} ({crew.members.length} members)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Select Date Range</label>
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
          disabled={!selectedCrew}
        >
          <FileText className="h-4 w-4" />
          Download as TXT
        </Button>
        <Button 
          className="w-full gap-2 ml-2" 
          onClick={handleDownloadPdf}
          disabled={!selectedCrew}
        >
          <FileDown className="h-4 w-4" />
          Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrewScheduleDownload;
