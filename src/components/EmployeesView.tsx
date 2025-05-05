import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Upload, CheckCircle, X, Calendar, Camera, Plus } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  status: string;
  avatarUrl?: string;
}

interface ScheduleTask {
  id: string;
  title: string;
  employeeId: number;
  employeeName: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Software Engineer',
    department: 'Engineering',
    status: 'Active',
    avatarUrl: ''
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
    avatarUrl: ''
  },
  {
    id: 3,
    name: 'Michael Brown',
    role: 'UX Designer',
    department: 'Design',
    status: 'Active',
    avatarUrl: ''
  }
];

const EmployeesView = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    department: '',
    status: 'Active',
    avatarUrl: ''
  });
  const [employees, setEmployees] = useState<Employee[]>([...mockEmployees]);
  const [employeeImage, setEmployeeImage] = useState<File | null>(null);
  const [employeeImagePreview, setEmployeeImagePreview] = useState<string>('');
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date());
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [draggedEmployee, setDraggedEmployee] = useState<Employee | null>(null);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduleTask[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Office'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalyzedData(null);
    }
  };

  const handleEmployeeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEmployeeImage(file);
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setEmployeeImagePreview(imageUrl);
    }
  };

  const handleAnalyzeFile = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    setIsAnalyzing(true);

    // Simulate analyzing the file
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedData({
        name: "Jennifer Wilson",
        role: "Marketing Specialist",
        department: "Marketing",
        status: "Active"
      });
      toast.success("File analyzed successfully");
    }, 1500);
  };

  const handleApplyData = () => {
    if (!analyzedData) return;
    
    const newEmployeeFromAnalysis = {
      id: employees.length + 1,
      ...analyzedData,
      avatarUrl: ''
    };
    
    setEmployees([...employees, newEmployeeFromAnalysis]);
    toast.success("Employee data has been added to the system");
    setSelectedFile(null);
    setAnalyzedData(null);
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.role || !newEmployee.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    let avatarUrl = '';
    
    // If we have an image preview, use that
    if (employeeImagePreview) {
      avatarUrl = employeeImagePreview;
    }

    const addedEmployee = {
      id: employees.length + 1,
      ...newEmployee,
      avatarUrl
    };

    setEmployees([...employees, addedEmployee]);
    toast.success("New employee has been added");
    
    // Reset form
    setNewEmployee({
      name: '',
      role: '',
      department: '',
      status: 'Active',
      avatarUrl: ''
    });
    setEmployeeImage(null);
    setEmployeeImagePreview('');
    setIsAddEmployeeOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle task creation
  const handleCreateTask = () => {
    if (!draggedEmployee || !newTask.title) {
      toast.error("Please provide all required information");
      return;
    }

    const task: ScheduleTask = {
      id: Date.now().toString(),
      title: newTask.title,
      employeeId: draggedEmployee.id,
      employeeName: draggedEmployee.name,
      date: selectedCalendarDate,
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      location: newTask.location
    };

    setScheduledTasks([...scheduledTasks, task]);
    setIsTaskDialogOpen(false);
    setDraggedEmployee(null);
    setNewTask({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      location: 'Office'
    });
    
    toast.success(`Scheduled task for ${draggedEmployee.name}`);
  };

  // Handle employee dragging for calendar
  const handleEmployeeDragStart = (employee: Employee, e: React.DragEvent) => {
    setDraggedEmployee(employee);
    
    // Set data transfer object with employee details
    e.dataTransfer.setData("application/json", JSON.stringify({
      id: employee.id,
      text: employee.name,
      type: 'employee',
      originalData: employee
    }));
    
    // Set the drag effect
    e.dataTransfer.effectAllowed = "copy";
    
    // Optional: Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.innerHTML = `
      <div class="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded shadow-md">
        <Calendar class="h-4 w-4 mr-2" />
        <span>${employee.name}</span>
      </div>
    `;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up after drag operation starts
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
    toast.info(`Drag ${employee.name} to calendar to schedule`, { duration: 2000 });
  };

  // Handle calendar drop event
  const handleCalendarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (draggedEmployee) {
      setIsTaskDialogOpen(true);
    }
  };

  // Allow dropping on the calendar
  const handleCalendarDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get tasks for the selected date
  const getTasksForSelectedDate = () => {
    return scheduledTasks.filter(
      task => task.date.toDateString() === selectedCalendarDate.toDateString()
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-500">Employees</h2>
        <div className="flex items-center gap-2">
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
                  <CardTitle className="text-sm">Mini Calendar</CardTitle>
                  <CardDescription className="text-xs">Drag employees here to schedule</CardDescription>
                </CardHeader>
                <CardContent 
                  className="p-2"
                  onDrop={handleCalendarDrop}
                  onDragOver={handleCalendarDragOver}
                >
                  <CalendarComponent
                    mode="single"
                    selected={selectedCalendarDate}
                    onSelect={(date) => date && setSelectedCalendarDate(date)}
                    className="rounded-md border pointer-events-auto"
                  />
                  
                  <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
                    <h3 className="text-xs font-medium flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Tasks for {format(selectedCalendarDate, 'MMM d, yyyy')}
                    </h3>
                    
                    {getTasksForSelectedDate().length > 0 ? (
                      getTasksForSelectedDate().map(task => (
                        <div key={task.id} className="text-xs p-1 bg-muted rounded-sm">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-muted-foreground">
                            {task.employeeName} • {task.startTime}-{task.endTime}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-center text-muted-foreground">
                        No tasks scheduled
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-1 h-7 text-xs"
                      onClick={() => {
                        setDraggedEmployee(null);
                        setIsTaskDialogOpen(true);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> 
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
          
          <Button className="gap-2" onClick={() => setIsAddEmployeeOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 pb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input placeholder="Search employees..." className="pl-10" />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map(employee => (
              <TableRow 
                key={employee.id} 
                className="hover:bg-accent/10 cursor-grab"
                draggable={true}
                onDragStart={(e) => handleEmployeeDragStart(employee, e)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                      <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{employee.name}</span>
                  </div>
                </TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {employee.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0 text-blue-600"
                    title="Schedule meeting"
                    onClick={() => {
                      setDraggedEmployee(employee);
                      setIsTaskDialogOpen(true);
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            {/* Employee Photo Upload */}
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
                  <Camera className="h-8 w-8 text-gray-400" />
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
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input 
                id="role" 
                name="role" 
                placeholder="Job Title" 
                value={newEmployee.role}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                name="department" 
                placeholder="Department" 
                value={newEmployee.department}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleAddEmployee}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Task</DialogTitle>
            <DialogDescription>
              {draggedEmployee ? `Create a task for ${draggedEmployee.name}` : 'Create a new task'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!draggedEmployee && (
              <div className="grid gap-2">
                <Label htmlFor="employee">Employee</Label>
                <Select
                  onValueChange={(value) => {
                    const employee = employees.find(e => e.id.toString() === value);
                    if (employee) setDraggedEmployee(employee);
                  }}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleCreateTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload and Analyze Section at the bottom */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upload & Analyze</CardTitle>
          <CardDescription>Upload employee documents or images to extract information automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="file-upload">Select Employee File</Label>
            <div className="flex gap-4">
              <Input id="file-upload" type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.csv" />
              <Button onClick={handleAnalyzeFile} disabled={!selectedFile || isAnalyzing} variant="secondary">
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
            </div>
          </div>

          {analyzedData && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Extracted Employee Data:</h3>
              <div className="bg-muted rounded-md p-3">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(analyzedData, null, 2)}
                </pre>
              </div>
              <Button onClick={handleApplyData} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Apply to Employees
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesView;
