
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { FileText, FileDown, User, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Employee, Crew, Task } from './ScheduleTypes';
import { downloadScheduleAsPdf, downloadScheduleAsTxt, filterTasksByDateRange } from '@/utils/downloadUtils';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';

interface UnifiedScheduleDownloadProps {
  employees: Employee[];
  crews: Crew[];
  tasks?: Task[];
  onClose?: () => void;
  defaultSelectedEmployeeId?: string;
  defaultSelectedCrewId?: string;
  defaultTab?: 'employee' | 'crew' | 'all';
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
  
  const [activeTab, setActiveTab] = useState<'employee' | 'crew' | 'all'>(defaultTab);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>(defaultSelectedEmployeeId);
  const [selectedCrewId, setSelectedCrewId] = useState<string | undefined>(defaultSelectedCrewId);
  const [useAllDates, setUseAllDates] = useState<boolean>(false);
  
  // Use the global app context to get additional tasks
  const { todos } = useAppContext();

  // Convert todos to tasks format
  const todoTasks: Task[] = todos
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
    if (!selectedEmployeeId) return [];
    
    const employeeName = getEmployeeNameById(selectedEmployeeId);
    
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
    
    // Filter by date range
    return filterTasksByDateRange(employeeTasks, date?.from, date?.to);
  };
  
  // Filter tasks for selected crew and within selected date range
  const getFilteredCrewTasks = (): Task[] => {
    if (!selectedCrewId) return [];
    
    const crewTasks = allTasks.filter(task => task.crewId === selectedCrewId);
    
    // If using all dates, return all crew tasks
    if (useAllDates) {
      return crewTasks;
    }
    
    // Filter by date range
    return filterTasksByDateRange(crewTasks, date?.from, date?.to);
  };

  // Get all tasks within selected date range
  const getAllTasks = (): Task[] => {
    // If using all dates, return all tasks
    if (useAllDates) {
      return allTasks;
    }
    
    if (!date?.from) return [];
    return filterTasksByDateRange(allTasks, date.from, date.to);
  };

  const handleDownloadPdf = () => {
    if (activeTab === 'employee') {
      const filteredTasks = getFilteredEmployeeTasks();
      
      if (!selectedEmployeeId) {
        toast({
          title: "Error",
          description: "Please select an employee first",
          variant: "destructive"
        });
        return;
      }
      
      if (filteredTasks.length === 0) {
        toast({
          title: "No tasks found",
          description: "No scheduled tasks for this employee",
          variant: "destructive"
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
          title: "Success",
          description: `Schedule for ${getEmployeeNameById(selectedEmployeeId)} downloaded as PDF`,
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
    } else if (activeTab === 'crew') {
      const filteredTasks = getFilteredCrewTasks();
      
      if (!selectedCrewId) {
        toast({
          title: "Error",
          description: "Please select a crew first",
          variant: "destructive"
        });
        return;
      }
      
      if (filteredTasks.length === 0) {
        toast({
          title: "No tasks found",
          description: "No scheduled tasks for this crew",
          variant: "destructive"
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
          title: "Success",
          description: `Schedule for ${getCrewNameById(selectedCrewId)} downloaded as PDF`,
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
    } else if (activeTab === 'all') {
      const allFilteredTasks = getAllTasks();
      
      if (allFilteredTasks.length === 0) {
        toast({
          title: "No tasks found",
          description: "No scheduled tasks found",
          variant: "destructive"
        });
        return;
      }
      
      try {
        downloadScheduleAsPdf(allFilteredTasks, {
          type: 'all',
          name: 'Complete Schedule'
        });
        toast({
          title: "Success",
          description: "Complete schedule downloaded as PDF",
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
    }
  };

  const handleDownloadTxt = () => {
    if (activeTab === 'employee') {
      const filteredTasks = getFilteredEmployeeTasks();
      
      if (!selectedEmployeeId) {
        toast({
          title: "Error",
          description: "Please select an employee first",
          variant: "destructive"
        });
        return;
      }
      
      if (filteredTasks.length === 0) {
        toast({
          title: "No tasks found",
          description: "No scheduled tasks for this employee",
          variant: "destructive"
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
          title: "Success",
          description: `Schedule for ${getEmployeeNameById(selectedEmployeeId)} downloaded as TXT`,
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
    } else if (activeTab === 'crew') {
      const filteredTasks = getFilteredCrewTasks();
      
      if (!selectedCrewId) {
        toast({
          title: "Error",
          description: "Please select a crew first",
          variant: "destructive"
        });
        return;
      }
      
      if (filteredTasks.length === 0) {
        toast({
          title: "No tasks found",
          description: "No scheduled tasks for this crew",
          variant: "destructive"
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
          title: "Success",
          description: `Schedule for ${getCrewNameById(selectedCrewId)} downloaded as TXT`,
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
    } else if (activeTab === 'all') {
      const allFilteredTasks = getAllTasks();
      
      if (allFilteredTasks.length === 0) {
        toast({
          title: "No tasks found",
          description: "No scheduled tasks found",
          variant: "destructive"
        });
        return;
      }
      
      try {
        downloadScheduleAsTxt(allFilteredTasks, {
          type: 'all',
          name: 'Complete Schedule'
        });
        toast({
          title: "Success",
          description: "Complete schedule downloaded as TXT",
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
    }
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
          Download schedule for an employee, crew, or the complete schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'employee' | 'crew' | 'all')}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Employee
            </TabsTrigger>
            <TabsTrigger value="crew" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Crew
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              All
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
          
          <TabsContent value="all" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Download a complete schedule for all employees and crews.
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Switch 
            id="useAllDates" 
            checked={useAllDates} 
            onCheckedChange={handleToggleChange} 
          />
          <Label htmlFor="useAllDates">Download complete schedule</Label>
        </div>

        {!useAllDates && (
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
                  <CalendarComponent
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
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          className="w-full gap-2" 
          onClick={handleDownloadTxt}
          disabled={(activeTab === 'employee' && !selectedEmployeeId) || 
                   (activeTab === 'crew' && !selectedCrewId)}
        >
          <FileText className="h-4 w-4" />
          Download as TXT
        </Button>
        <Button 
          className="w-full gap-2 ml-2" 
          onClick={handleDownloadPdf}
          disabled={(activeTab === 'employee' && !selectedEmployeeId) || 
                   (activeTab === 'crew' && !selectedCrewId)}
        >
          <FileDown className="h-4 w-4" />
          Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UnifiedScheduleDownload;
