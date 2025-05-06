import React, { useState, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  UserPlus, 
  Plus, 
  Check, 
  Users, 
  Calendar,
  Cog,
  ListCheck,
  GripHorizontal,
  Download,
  FileDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import EmployeeScheduleDownload from './schedule/EmployeeScheduleDownload';
import CrewScheduleDownload from './schedule/CrewScheduleDownload';

const EmployeesView = () => {
  const { 
    employees, 
    setEmployees, 
    crews, 
    setCrews, 
    todos, 
    setTodos,
    calendarDate,
    setCalendarDate
  } = useAppContext();
  
  // State for UI elements
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddCrewOpen, setIsAddCrewOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isCrewAssignOpen, setIsCrewAssignOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeImagePreview, setEmployeeImagePreview] = useState<string>('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(calendarDate);
  const [selectedTab, setSelectedTab] = useState<'employees' | 'crews'>('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  
  // Form state
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    position: '',
    email: '',
    phone: '',
    crews: [] as string[]
  });
  
  const [newCrew, setNewCrew] = useState({
    id: '',
    name: '',
    members: [] as string[]
  });

  const [newTask, setNewTask] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Office',
    assignedTo: '',
    assignedToAvatars: [] as string[],
    crew: [] as string[]
  });
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Employee operations
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.position) {
      toast.error("Please fill in all required fields");
      return;
    }

    const employeeId = `e-${Date.now()}`;
    
    const addedEmployee = {
      id: employeeId,
      name: newEmployee.name,
      position: newEmployee.position,
      email: newEmployee.email,
      phone: newEmployee.phone,
      crews: newEmployee.crews
    };

    setEmployees([...employees, addedEmployee]);
    toast.success("New employee has been added");
    
    // Reset form
    setNewEmployee({
      id: '',
      name: '',
      position: '',
      email: '',
      phone: '',
      crews: []
    });
    setEmployeeImagePreview('');
    setIsAddEmployeeOpen(false);
  };

  // Crew operations
  const handleAddCrew = () => {
    if (!newCrew.name) {
      toast.error("Please provide a crew name");
      return;
    }

    const crewId = `c-${Date.now()}`;
    
    const addedCrew = {
      id: crewId,
      name: newCrew.name,
      members: newCrew.members
    };

    setCrews([...crews, addedCrew]);
    toast.success("New crew has been created");
    
    // Reset form
    setNewCrew({
      id: '',
      name: '',
      members: []
    });
    setIsAddCrewOpen(false);
  };

  // Task operations
  const handleCreateTask = () => {
    if (!newTask.title) {
      toast.error("Please provide a task title");
      return;
    }

    const taskId = `t-${Date.now()}`;
    
    const newTodo = {
      id: taskId,
      text: newTask.title,
      completed: false,
      date: selectedCalendarDate,
      assignedTo: newTask.assignedTo,
      assignedToAvatars: newTask.assignedToAvatars,
      crew: newTask.crew,
      location: newTask.location,
      startTime: newTask.startTime,
      endTime: newTask.endTime
    };

    setTodos([...todos, newTodo]);
    setIsTaskDialogOpen(false);
    
    // Reset form
    setNewTask({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      location: 'Office',
      assignedTo: '',
      assignedToAvatars: [],
      crew: []
    });
    
    toast.success("Task created successfully");
  };

  // Handle input changes
  const handleEmployeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCrewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCrew(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new state for managing multiple crew assignments
  const [crewsToAssign, setCrewsToAssign] = useState<string[]>([]);
  
  const handleEmployeeCrewAssignment = () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    if (crewsToAssign.length === 0) {
      toast.error("Please select at least one crew");
      return;
    }

    // Update employee's crews
    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee) {
        // Get current crews or initialize empty array
        const currentCrews = emp.crews || [];
        
        // Add new crews that aren't already assigned
        const updatedCrews = [...currentCrews];
        
        crewsToAssign.forEach(crewId => {
          if (!updatedCrews.includes(crewId)) {
            updatedCrews.push(crewId);
          }
        });
        
        return { ...emp, crews: updatedCrews };
      }
      return emp;
    });

    // Update crews' members
    const updatedCrews = crews.map(crew => {
      if (crewsToAssign.includes(crew.id)) {
        // Add employee to crew if not already a member
        if (!crew.members.includes(selectedEmployee)) {
          return { ...crew, members: [...crew.members, selectedEmployee] };
        }
      }
      return crew;
    });

    setEmployees(updatedEmployees);
    setCrews(updatedCrews);
    setIsCrewAssignOpen(false);
    setSelectedEmployee(null);
    setCrewsToAssign([]);
    toast.success("Employee assigned to crews successfully");
  };

  const handleEmployeeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setEmployeeImagePreview(imageUrl);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Task assignment helper
  const openTaskAssignmentForEmployee = (employeeId: string, employeeName: string) => {
    setNewTask({
      ...newTask,
      assignedTo: employeeName,
      assignedToAvatars: [],
      crew: []
    });
    setIsTaskDialogOpen(true);
  };

  const openTaskAssignmentForCrew = (crewId: string, crewName: string) => {
    // Get all employee names in this crew
    const crewMembers = crews.find(c => c.id === crewId)?.members || [];
    const memberNames = crewMembers.map(memberId => {
      const employee = employees.find(e => e.id === memberId);
      return employee ? employee.name : "";
    }).filter(Boolean);

    setNewTask({
      ...newTask,
      assignedTo: memberNames.join(", "),
      crew: [crewId]
    });
    setIsTaskDialogOpen(true);
  };

  // Filtering
  const filteredEmployees = searchTerm 
    ? employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.position && emp.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : employees;

  const filteredCrews = searchTerm
    ? crews.filter(crew => 
        crew.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : crews;

  // Helper to get employee tasks
  const getEmployeeTasks = (employeeId: string) => {
    const employeeName = employees.find(e => e.id === employeeId)?.name;
    if (!employeeName) return [];

    return todos.filter(todo => 
      todo.assignedTo === employeeName || 
      (todo.crew && todo.crew.some(crewId => {
        const crew = crews.find(c => c.id === crewId);
        return crew && crew.members.includes(employeeId);
      }))
    );
  };

  // Helper to get crew tasks
  const getCrewTasks = (crewId: string) => {
    return todos.filter(todo => 
      todo.crew && todo.crew.includes(crewId)
    );
  };

  // Get crew name by ID
  const getCrewNameById = (crewId: string) => {
    const crew = crews.find(c => c.id === crewId);
    return crew ? crew.name : "";
  };

  // Get employee name by ID
  const getEmployeeNameById = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : "";
  };

  // Get crew members count
  const getCrewMembersCount = (crewId: string) => {
    const crew = crews.find(c => c.id === crewId);
    return crew ? crew.members.length : 0;
  };

  // Enhanced drag functionality
  const handleEmployeeDragStart = (e: React.DragEvent, employee: any) => {
    // Set dragged employee data
    const dragData = {
      type: 'employee',
      id: employee.id,
      text: `Employee - ${employee.name}`,
      originalData: {
        id: employee.id,
        name: employee.name,
        position: employee.position,
        email: employee.email,
        avatarUrl: employee.avatarUrl
      }
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create and set a custom drag image
    const dragPreview = document.createElement('div');
    dragPreview.classList.add('drag-preview');
    dragPreview.innerHTML = `
      <div class="bg-primary text-white px-2 py-1 rounded text-xs flex items-center gap-1">
        <span>${employee.name}</span>
      </div>
    `;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    
    // Clean up after drag starts
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };
  
  const handleCrewDragStart = (e: React.DragEvent, crew: any) => {
    // Get crew members
    const members = crew.members.map((memberId: string) => {
      const employee = employees.find(e => e.id === memberId);
      return employee ? employee.name : '';
    }).filter(Boolean);
    
    // Set dragged crew data
    const dragData = {
      type: 'crew',
      id: crew.id,
      text: `Crew - ${crew.name}`,
      originalData: {
        id: crew.id,
        name: crew.name,
        members: members,
        memberCount: members.length
      }
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create and set a custom drag image
    const dragPreview = document.createElement('div');
    dragPreview.classList.add('drag-preview');
    dragPreview.innerHTML = `
      <div class="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
        <span>${crew.name} (${members.length})</span>
      </div>
    `;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    
    // Clean up after drag starts
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };

  // Add new state for download dialogs
  const [isEmployeeScheduleDownloadOpen, setIsEmployeeScheduleDownloadOpen] = useState(false);
  const [isCrewScheduleDownloadOpen, setIsCrewScheduleDownloadOpen] = useState(false);
  const [selectedEmployeeForDownload, setSelectedEmployeeForDownload] = useState<{id: string, name: string} | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-semibold text-primary">Workforce Management</h2>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsCrewAssignOpen(true)}
          >
            <Users className="h-4 w-4" />
            Assign to Crew
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="end">
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Calendar</CardTitle>
                  <CardDescription className="text-xs">Select a date to schedule tasks</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <CalendarComponent
                    mode="single"
                    selected={selectedCalendarDate}
                    onSelect={(date) => date && setSelectedCalendarDate(date)}
                    className="rounded-md border"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-2 h-8 text-xs"
                    onClick={() => setIsTaskDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> 
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
          <Button 
            onClick={() => {
              setSelectedTab('employees');
              setIsAddEmployeeOpen(true);
            }}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Button>
          <Button 
            onClick={() => {
              setSelectedTab('crews');
              setIsAddCrewOpen(true);
            }}
            variant="secondary"
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Add Crew
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsCrewScheduleDownloadOpen(true)}
          >
            <FileDown className="h-4 w-4" />
            Crew Schedules
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 pb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search employees or crews..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="employees" value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'employees' | 'crews')} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="employees" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="crews" className="gap-2">
            <Users className="h-4 w-4" />
            Crews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Manage your workforce and assign tasks or crews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Crews</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map(employee => (
                        <TableRow 
                          key={employee.id}
                          draggable
                          onDragStart={(e) => handleEmployeeDragStart(e, employee)}
                          className="hover:bg-accent/50 transition-colors cursor-grab"
                        >
                          <TableCell className="w-10">
                            <GripHorizontal className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border">
                                <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span>{employee.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {employee.email && (
                                <div>{employee.email}</div>
                              )}
                              {employee.phone && (
                                <div>{employee.phone}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {employee.crews && employee.crews.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {employee.crews.map(crewId => (
                                  <Badge key={crewId} variant="outline" className="text-xs">
                                    {getCrewNameById(crewId)}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No crews</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Assign to crew"
                                onClick={() => {
                                  setSelectedEmployee(employee.id);
                                  setIsCrewAssignOpen(true);
                                }}
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Schedule task"
                                onClick={() => openTaskAssignmentForEmployee(employee.id, employee.name)}
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Download schedule"
                                onClick={() => {
                                  setSelectedEmployeeForDownload({
                                    id: employee.id,
                                    name: employee.name
                                  });
                                  setIsEmployeeScheduleDownloadOpen(true);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No employees found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crews" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Crew Management</CardTitle>
              <CardDescription>Organize your employees into crews for easier task assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Crew Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Active Tasks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCrews.length > 0 ? (
                      filteredCrews.map(crew => (
                        <TableRow 
                          key={crew.id}
                          draggable
                          onDragStart={(e) => handleCrewDragStart(e, crew)}
                          className="hover:bg-accent/50 transition-colors cursor-grab"
                        >
                          <TableCell className="w-10">
                            <GripHorizontal className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {crew.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {crew.members.length > 0 ? (
                                <div className="flex -space-x-2">
                                  {crew.members.slice(0, 3).map((memberId, index) => (
                                    <Avatar key={memberId} className="h-6 w-6 border-2 border-background">
                                      <AvatarFallback className="text-xs">
                                        {getEmployeeNameById(memberId).substring(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {crew.members.length > 3 && (
                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs">
                                      +{crew.members.length - 3}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">No members</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getCrewTasks(crew.id).length > 0 ? (
                              <Badge variant="secondary">
                                {getCrewTasks(crew.id).length} {getCrewTasks(crew.id).length === 1 ? 'task' : 'tasks'}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">No tasks</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Manage members"
                                onClick={() => {
                                  setSelectedCrew(crew.id);
                                  setIsCrewAssignOpen(true);
                                }}
                              >
                                <Cog className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Assign task to crew"
                                onClick={() => openTaskAssignmentForCrew(crew.id, crew.name)}
                              >
                                <ListCheck className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Download crew schedule"
                                onClick={() => {
                                  setSelectedCrew(crew.id);
                                  setIsCrewScheduleDownloadOpen(true);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No crews found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New section for schedule downloads */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Schedule Downloads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Employee Schedules
              </CardTitle>
              <CardDescription>
                Download schedules for individual employees within specific date ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select an employee from the list and click the download icon to generate their personalized schedule.
              </p>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => {
                  if (employees.length > 0) {
                    setSelectedEmployeeForDownload({
                      id: employees[0].id,
                      name: employees[0].name
                    });
                    setIsEmployeeScheduleDownloadOpen(true);
                  } else {
                    toast.error("No employees available");
                  }
                }}>
                  Download Employee Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Crew Schedules
              </CardTitle>
              <CardDescription>
                Download schedules for entire crews within specific date ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select a crew and generate a comprehensive schedule for all members and assignments.
              </p>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsCrewScheduleDownloadOpen(true)}>
                  Download Crew Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new employee to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-2">
              <div 
                className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer mb-2"
                onClick={triggerFileInput}
              >
                {employeeImagePreview ? (
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={employeeImagePreview} 
                      alt="Employee preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <UserPlus className="h-8 w-8 text-gray-400" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleEmployeeImageChange}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {employeeImagePreview ? "Change photo" : "Add employee photo"}
              </span>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Full Name" 
                value={newEmployee.name}
                onChange={handleEmployeeInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position" 
                name="position" 
                placeholder="Job Title" 
                value={newEmployee.position}
                onChange={handleEmployeeInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                placeholder="Email Address" 
                value={newEmployee.email}
                onChange={handleEmployeeInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                placeholder="Phone Number" 
                value={newEmployee.phone}
                onChange={handleEmployeeInputChange}
              />
            </div>
            {crews.length > 0 && (
              <div className="grid gap-2">
                <Label>Assign to Crews</Label>
                <Select 
                  onValueChange={(value) => {
                    setNewEmployee(prev => ({
                      ...prev,
                      crews: [...(prev.crews || []), value]
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a crew" />
                  </SelectTrigger>
                  <SelectContent>
                    {crews.map(crew => (
                      <SelectItem 
                        key={crew.id} 
                        value={crew.id}
                        disabled={newEmployee.crews?.includes(crew.id)}
                      >
                        {crew.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newEmployee.crews && newEmployee.crews.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newEmployee.crews.map(crewId => (
                      <Badge 
                        key={crewId} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {getCrewNameById(crewId)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            setNewEmployee(prev => ({
                              ...prev,
                              crews: prev.crews?.filter(id => id !== crewId) || []
                            }));
                          }}
                        >
                          &times;
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleAddEmployee}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Crew Dialog */}
      <Dialog open={isAddCrewOpen} onOpenChange={setIsAddCrewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Crew</DialogTitle>
            <DialogDescription>
              Create a crew and assign employees to work together.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="crewName">Crew Name</Label>
              <Input 
                id="crewName" 
                name="name" 
                placeholder="Crew Name" 
                value={newCrew.name}
                onChange={handleCrewInputChange}
                required
              />
            </div>
            {employees.length > 0 && (
              <div className="grid gap-2">
                <Label>Add Members</Label>
                <Select 
                  onValueChange={(value) => {
                    setNewCrew(prev => ({
                      ...prev,
                      members: [...prev.members, value]
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employees" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newCrew.members.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newCrew.members.map(memberId => {
                      const employee = employees.find(e => e.id === memberId);
                      return (
                        <Badge 
                          key={memberId} 
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {employee?.name || 'Unknown'}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                              setNewCrew(prev => ({
                                ...prev,
                                members: prev.members.filter(id => id !== memberId)
                              }));
                            }}
                          >
                            &times;
                          </Button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleAddCrew}>Create Crew</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign to Crew Dialog */}
      <Dialog open={isCrewAssignOpen} onOpenChange={setIsCrewAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign to Crews</DialogTitle>
            <DialogDescription>
              Select an employee and one or more crews to assign them to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee</Label>
              <Select 
                value={selectedEmployee || ""}
                onValueChange={(value) => {
                  setSelectedEmployee(value);
                  // Reset crews to assign when employee changes
                  setCrewsToAssign([]);
                }}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
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
            
            <div className="grid gap-2">
              <Label>Assign to Crews</Label>
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                {crews.length > 0 ? (
                  crews.map(crew => {
                    const isSelected = crewsToAssign.includes(crew.id);
                    
                    // Check if employee is already in this crew
                    const isAlreadyInCrew = selectedEmployee && 
                      employees.find(e => e.id === selectedEmployee)?.crews?.includes(crew.id);
                    
                    return (
                      <div 
                        key={crew.id}
                        className={`flex items-center justify-between p-2 rounded-md mb-1 cursor-pointer hover:bg-accent/50 ${
                          isSelected ? 'bg-accent' : isAlreadyInCrew ? 'bg-muted' : ''
                        }`}
                        onClick={() => handleCrewSelection(crew.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{crew.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAlreadyInCrew && !isSelected && (
                            <Badge variant="outline" className="text-xs">Already member</Badge>
                          )}
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-2 text-muted-foreground">No crews available</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="button" 
              onClick={handleEmployeeCrewAssignment}
              disabled={!selectedEmployee || crewsToAssign.length === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              Assign to Crews
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Task</DialogTitle>
            <DialogDescription>
              Create a new task and assign it to employees or crews
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input 
                id="task-title" 
                placeholder="Task title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <div className="border rounded-md p-2 bg-muted/30">
                {format(selectedCalendarDate, 'MMMM d, yyyy')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input 
                  id="start-time" 
                  type="time" 
                  value={newTask.startTime}
                  onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input 
                  id="end-time" 
                  type="time" 
                  value={newTask.endTime}
                  onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="Location" 
                value={newTask.location}
                onChange={(e) => setNewTask({...newTask, location: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Assign To</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Tabs defaultValue="employee" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="employee">Employee</TabsTrigger>
                      <TabsTrigger value="crew">Crew</TabsTrigger>
                    </TabsList>
                    <TabsContent value="employee" className="p-0 mt-2">
                      <Select 
                        onValueChange={(value) => {
                          const employee = employees.find(e => e.id === value);
                          if (employee) {
                            setNewTask({
                              ...newTask, 
                              assignedTo: employee.name,
                              crew: []
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={newTask.assignedTo || "Select employee"} />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(employee => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TabsContent>
                    <TabsContent value="crew" className="p-0 mt-2">
                      <Select 
                        onValueChange={(value) => {
                          const crew = crews.find(c => c.id === value);
                          if (crew) {
                            setNewTask({
                              ...newTask, 
                              assignedTo: `Crew: ${crew.name}`,
                              crew: [crew.id]
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select crew" />
                        </SelectTrigger>
                        <SelectContent>
                          {crews.map(crew => (
                            <SelectItem key={crew.id} value={crew.id}>
                              {crew.name} ({getCrewMembersCount(crew.id)} members)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Schedule Download Dialog */}
      <Dialog open={isEmployeeScheduleDownloadOpen} onOpenChange={setIsEmployeeScheduleDownloadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download Employee Schedule</DialogTitle>
            <DialogDescription>
              Download schedule for {selectedEmployeeForDownload?.name || "employee"}
            </DialogDescription>
          </DialogHeader>
          {selectedEmployeeForDownload && (
            <EmployeeScheduleDownload
              employeeId={selectedEmployeeForDownload.id}
              employeeName={selectedEmployeeForDownload.name}
              tasks={todos.map(todo => ({
                id: todo.id,
                title: todo.text,
                date: todo.date,
                completed: todo.completed,
                assignedTo: todo.assignedTo,
                crew: todo.crew,
                startTime: todo.startTime,
                endTime: todo.endTime,
                location: todo.location
              }))}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Crew Schedule Download Dialog */}
      <Dialog open={isCrewScheduleDownloadOpen} onOpenChange={setIsCrewScheduleDownloadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download Crew Schedule</DialogTitle>
            <DialogDescription>
              Select a crew and date range to download their schedule
            </DialogDescription>
          </DialogHeader>
          <CrewScheduleDownload
            crews={crews}
            tasks={todos.map(todo => ({
              id: todo.id,
              title: todo.text,
              date: todo.date,
              completed: todo.completed,
              assignedTo: todo.assignedTo,
              crew: todo.crew,
              crewId: todo.crew?.[0], // In the app context, crew is stored as an array with crewId
              startTime: todo.startTime,
              endTime: todo.endTime,
              location: todo.location
            }))}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesView;
