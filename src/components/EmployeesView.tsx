
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
  ListCheck
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
  DialogClose
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

  const handleEmployeeCrewAssignment = () => {
    if (!selectedEmployee || !selectedCrew) {
      toast.error("Please select both an employee and a crew");
      return;
    }

    // Update employee's crews
    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee) {
        // Add crew to employee if not already assigned
        if (!emp.crews?.includes(selectedCrew)) {
          const updatedCrews = emp.crews ? [...emp.crews, selectedCrew] : [selectedCrew];
          return { ...emp, crews: updatedCrews };
        }
      }
      return emp;
    });

    // Update crew's members
    const updatedCrews = crews.map(crew => {
      if (crew.id === selectedCrew) {
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
    setSelectedCrew(null);
    toast.success("Employee assigned to crew successfully");
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
                        <TableRow key={employee.id}>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
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
                      <TableHead>Crew Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Active Tasks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCrews.length > 0 ? (
                      filteredCrews.map(crew => (
                        <TableRow key={crew.id}>
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
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
                      <SelectItem 
                        key={employee.id} 
                        value={employee.id}
                        disabled={newCrew.members.includes(employee.id)}
                      >
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
            <DialogTitle>Assign to Crew</DialogTitle>
            <DialogDescription>
              Select an employee and a crew to assign them to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee</Label>
              <Select 
                value={selectedEmployee || ""}
                onValueChange={setSelectedEmployee}
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
              <Label htmlFor="crew">Crew</Label>
              <Select 
                value={selectedCrew || ""}
                onValueChange={setSelectedCrew}
              >
                <SelectTrigger id="crew">
                  <SelectValue placeholder="Select crew" />
                </SelectTrigger>
                <SelectContent>
                  {crews.map(crew => (
                    <SelectItem key={crew.id} value={crew.id}>
                      {crew.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="button" 
              onClick={handleEmployeeCrewAssignment}
              disabled={!selectedEmployee || !selectedCrew}
            >
              <Check className="mr-2 h-4 w-4" />
              Assign
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
    </div>
  );
};

export default EmployeesView;
