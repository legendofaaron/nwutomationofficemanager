
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
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
import { downloadScheduleAsPdf, downloadScheduleAsTxt, filterTasksByDateRange } from '@/utils/downloadUtils';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [useAllDates, setUseAllDates] = useState<boolean>(true);
  
  // Use the global app context to get additional tasks
  const { todos } = useAppContext();

  // Convert todos to tasks format if they're assigned to selected crew
  const todoTasks: Task[] = todos
    .filter(todo => todo.crewId === selectedCrew)
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
  
  // Filter tasks for selected crew and within selected date range if date filtering is enabled
  const getFilteredTasks = (): Task[] => {
    if (!selectedCrew) return [];
    
    const crewTasks = allTasks.filter(task => task.crewId === selectedCrew);
    
    // If using all dates, return all tasks for the crew
    if (useAllDates) {
      return crewTasks;
    }
    
    // Otherwise, filter by date range
    return filterTasksByDateRange(crewTasks, date?.from, date?.to);
  };
  
  // Get crew name by ID
  const getCrewNameById = (crewId: string): string => {
    const crew = crews.find(c => c.id === crewId);
    return crew ? crew.name : "Unknown Crew";
  };

  const handleDownloadPdf = () => {
    if (!selectedCrew) {
      toast({
        title: "Error",
        description: "Please select a crew first", 
        variant: "destructive"
      });
      return;
    }
    
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast({
        title: "No tasks found",
        description: "No scheduled tasks found for this crew",
        variant: "destructive"
      });
      return;
    }
    
    try {
      downloadScheduleAsPdf(filteredTasks, {
        type: 'crew',
        id: selectedCrew,
        name: getCrewNameById(selectedCrew)
      });
      toast({
        title: "Success",
        description: `Schedule for ${getCrewNameById(selectedCrew)} downloaded as PDF`,
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
    if (!selectedCrew) {
      toast({
        title: "Error",
        description: "Please select a crew first",
        variant: "destructive"
      });
      return;
    }
    
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      toast({
        title: "No tasks found",
        description: "No scheduled tasks found for this crew",
        variant: "destructive" 
      });
      return;
    }
    
    try {
      downloadScheduleAsTxt(filteredTasks, {
        type: 'crew',
        id: selectedCrew,
        name: getCrewNameById(selectedCrew)
      });
      toast({
        title: "Success",
        description: `Schedule for ${getCrewNameById(selectedCrew)} downloaded as TXT`,
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
        <CardTitle className="text-base font-medium">Download Crew Schedule</CardTitle>
        <CardDescription>
          Download a crew's complete schedule
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
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="useAllDates" 
              checked={useAllDates} 
              onCheckedChange={handleToggleChange} 
            />
            <Label htmlFor="useAllDates">Download complete crew schedule</Label>
          </div>
          
          {!useAllDates && (
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
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 w-full">
        <Button 
          variant="outline" 
          className="w-full gap-2 bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-700" 
          onClick={handleDownloadTxt}
          disabled={!selectedCrew}
        >
          <FileText className="h-5 w-5" />
          Download as TXT
        </Button>
        <Button 
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={handleDownloadPdf}
          disabled={!selectedCrew}
        >
          <FileDown className="h-5 w-5" />
          Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrewScheduleDownload;
