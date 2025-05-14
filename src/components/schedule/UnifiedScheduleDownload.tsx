
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon, Download, FileText, FileDown, User, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { Employee, Crew, Task } from './ScheduleTypes';
import { downloadScheduleAsPdf, downloadScheduleAsTxt } from '@/utils/downloadUtils';
import { toast } from '@/components/ui/use-toast';

interface UnifiedScheduleDownloadProps {
  employees: Employee[];
  crews: Crew[];
  tasks?: Task[];
  onClose?: () => void;
  defaultSelectedEmployeeId?: string;
  defaultSelectedCrewId?: string;
  defaultTab?: 'employee' | 'crew';
}

const UnifiedScheduleDownload: React.FC<UnifiedScheduleDownloadProps> = ({
  employees,
  crews,
  tasks = [],
  onClose,
  defaultSelectedEmployeeId,
  defaultSelectedCrewId,
  defaultTab = 'employee'
}) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });
  
  const [activeTab, setActiveTab] = useState<'employee' | 'crew'>(defaultTab);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>(defaultSelectedEmployeeId);
  const [selectedCrewId, setSelectedCrewId] = useState<string | undefined>(defaultSelectedCrewId);
  
  // Get employee name by ID
  const getEmployeeNameById = (employeeId?: string): string => {
    if (!employeeId) return "";
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };

  // Get crew name by ID
  const getCrewNameById = (crewId?: string): string => {
    if (!crewId) return "";
    const crew = crews.find(c => c.id === crewId);
    return crew ? crew.name : "Unknown Crew";
  };

  // Filter tasks for employee and within selected date range
  const getFilteredEmployeeTasks = (): Task[] => {
    if (!date?.from || !selectedEmployeeId) return [];
    
    const employeeName = getEmployeeNameById(selectedEmployeeId);
    
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
  
  // Filter tasks for selected crew and within selected date range
  const getFilteredCrewTasks = (): Task[] => {
    if (!date?.from || !selectedCrewId) return [];
    
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
    if (activeTab === 'employee') {
      const filteredTasks = getFilteredEmployeeTasks();
      
      if (!selectedEmployeeId) {
        toast({
          variant: "destructive",
          title: "No employee selected",
          description: "Please select an employee first"
        });
        return;
      }
      
      if (filteredTasks.length === 0) {
        toast({
          variant: "destructive",
          title: "No tasks found",
          description: "No scheduled tasks for this employee in the selected date range"
        });
        return;
      }
      
      try {
        downloadScheduleAsPdf(filteredTasks, {
          type: 'employee',
          id: selectedEmployeeId,
          name: getEmployeeNameById(selectedEmployeeId)
        });
        toast({
          title: "Schedule downloaded",
          description: `Schedule for ${getEmployeeNameById(selectedEmployeeId)} downloaded as PDF`
        });
        if (onClose) onClose();
      } catch (error) {
        console.error("Error downloading PDF:", error);
        toast({
          variant: "destructive",
          title: "Download failed",
          description: "Failed to download schedule as PDF"
        });
      }
    } else {
      const filteredTasks = getFilteredCrewTasks();
      
      if (!selectedCrewId) {
        toast({
          variant: "destructive",
          title: "No crew selected",
          description: "Please select a crew first"
        });
        return;
      }
      
      if (filteredTasks.length === 0) {
        toast({
          variant: "destructive",
          title: "No tasks found",
          description: "No scheduled tasks for this crew in the selected date range"
        });
        return;
      }
      
      try {
        downloadScheduleAsPdf(filteredTasks, {
          type: 'crew',
          id: selectedCrewId,
          name: getCrewNameById(selectedCrewId)
        });
        toast({
          title: "Schedule downloaded",
          description: `Schedule for ${getCrewNameById(selectedCrewId)} downloaded as PDF`
        });
        if (onClose) onClose();
      } catch (error) {
        console.error("Error downloading PDF:", error);
        toast({
          variant: "destructive",
          title: "Download failed",
          description: "Failed to download schedule as PDF"
        });
      }
    }
  };

  const handleDownloadTxt = () => {
    if (activeTab === 'employee') {
      const filteredTasks = getFilteredEmployeeTasks();
      
      if (!selectedEmployeeId) {
        toast({
          variant: "destructive",
          title: "No employee selected",
          description: "Please select an employee first"
        });
        return;
      }
      
      if (filteredTasks.length === 0) {
        toast({
          variant: "destructive",
          title: "No tasks found",
          description: "No scheduled tasks for this employee in the selected date range"
        });
        return;
      }
      
      try {
        downloadScheduleAsTxt(filteredTasks, {
          type: 'employee',
          id: selectedEmployeeId,
          name: getEmployeeNameById(selectedEmployeeId)
        });
        toast({
          title: "Schedule downloaded",
          description: `Schedule for ${getEmployeeNameById(selectedEmployeeId)} downloaded as TXT`
        });
        if (onClose) onClose();
      } catch (error) {
        console.error("Error downloading TXT:", error);
        toast({
          variant: "destructive",
          title: "Download failed",
          description: "Failed to download schedule as TXT"
        });
      }
    } else {
      const filteredTasks = getFilteredCrewTasks();
      
      if (!selectedCrewId) {
        toast({
          variant: "destructive",
          title: "No crew selected",
          description: "Please select a crew first"
        });
        return;
      }
      
      if (filteredTasks.length === 0) {
        toast({
          variant: "destructive",
          title: "No tasks found",
          description: "No scheduled tasks for this crew in the selected date range"
        });
        return;
      }
      
      try {
        downloadScheduleAsTxt(filteredTasks, {
          type: 'crew',
          id: selectedCrewId,
          name: getCrewNameById(selectedCrewId)
        });
        toast({
          title: "Schedule downloaded",
          description: `Schedule for ${getCrewNameById(selectedCrewId)} downloaded as TXT`
        });
        if (onClose) onClose();
      } catch (error) {
        console.error("Error downloading TXT:", error);
        toast({
          variant: "destructive",
          title: "Download failed",
          description: "Failed to download schedule as TXT"
        });
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Download Schedule</CardTitle>
        <CardDescription>
          Download schedule for an employee or crew
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'employee' | 'crew')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Employee
            </TabsTrigger>
            <TabsTrigger value="crew" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Crew
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="employee" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Employee</label>
              <Select 
                value={selectedEmployeeId} 
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="crew" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Crew</label>
              <Select 
                value={selectedCrewId} 
                onValueChange={setSelectedCrewId}
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
          </TabsContent>
        </Tabs>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Select Date Range</label>
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
          disabled={(!selectedEmployeeId && activeTab === 'employee') || 
                   (!selectedCrewId && activeTab === 'crew') || 
                   !date?.from}
        >
          <FileText className="h-4 w-4" />
          Download as TXT
        </Button>
        <Button 
          className="w-full gap-2 ml-2" 
          onClick={handleDownloadPdf}
          disabled={(!selectedEmployeeId && activeTab === 'employee') || 
                   (!selectedCrewId && activeTab === 'crew') || 
                   !date?.from}
        >
          <FileDown className="h-4 w-4" />
          Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UnifiedScheduleDownload;
