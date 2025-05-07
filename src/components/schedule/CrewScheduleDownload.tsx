
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon, FileText, FileDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Task } from './ScheduleTypes';
import { downloadScheduleAsPdf, downloadScheduleAsTxt } from '@/utils/downloadUtils';
import { toast } from 'sonner';

interface Crew {
  id: string;
  name: string;
  members: string[];
}

interface CrewScheduleDownloadProps {
  crews: Crew[];
  tasks: Task[];
}

const CrewScheduleDownload = ({ crews, tasks }: CrewScheduleDownloadProps) => {
  const [selectedCrewId, setSelectedCrewId] = useState<string>("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });

  // Get the selected crew
  const selectedCrew = crews.find(crew => crew.id === selectedCrewId);

  // Filter tasks for the selected crew and within selected date range
  const getFilteredTasks = (): Task[] => {
    if (!selectedCrewId || !date?.from) return [];
    
    return tasks.filter(task => {
      // Check if task is assigned to this crew
      const isAssignedToCrew = task.crewId === selectedCrewId;
      
      // Check if task date is within the selected range
      const taskDate = new Date(task.date);
      const isInDateRange = date.from && taskDate >= date.from && 
                            (!date.to || taskDate <= date.to);
      
      return isAssignedToCrew && isInDateRange;
    });
  };

  const handleDownloadPdf = () => {
    if (!selectedCrew) {
      toast.error("Please select a crew first");
      return;
    }
    
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast.error("No scheduled tasks for this crew in the selected date range");
      return;
    }
    
    try {
      downloadScheduleAsPdf(filteredTasks, {
        type: 'crew',
        id: selectedCrewId,
        name: selectedCrew.name
      });
      toast.success(`Schedule for ${selectedCrew.name} crew downloaded as PDF`);
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
      toast.error("No scheduled tasks for this crew in the selected date range");
      return;
    }
    
    try {
      downloadScheduleAsTxt(filteredTasks, {
        type: 'crew',
        id: selectedCrewId,
        name: selectedCrew.name
      });
      toast.success(`Schedule for ${selectedCrew.name} crew downloaded as TXT`);
    } catch (error) {
      console.error("Error downloading TXT:", error);
      toast.error("Failed to download schedule as TXT");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Crew Schedule Download</CardTitle>
        <CardDescription>
          Download schedule for a specific crew and date range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex flex-col">
            <Select value={selectedCrewId} onValueChange={setSelectedCrewId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a crew" />
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
          disabled={!selectedCrewId || !date?.from}
        >
          <FileText className="h-4 w-4" />
          Download as TXT
        </Button>
        <Button 
          className="w-full gap-2 ml-2" 
          onClick={handleDownloadPdf}
          disabled={!selectedCrewId || !date?.from}
        >
          <FileDown className="h-4 w-4" />
          Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrewScheduleDownload;
