
import React, { useState, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, UserPlus, Plus, Users, Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Import components
import EmployeeList from './EmployeeList';
import CrewList from './CrewList';
import AddEmployeeDialog from './AddEmployeeDialog';
import AddCrewDialog from './AddCrewDialog';
import CrewAssignDialog from './CrewAssignDialog';
import TaskDialog from './TaskDialog';
import DownloadCardsSection from './DownloadCardsSection';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import EmployeeScheduleDownload from '../schedule/EmployeeScheduleDownload';
import CrewScheduleDownload from '../schedule/CrewScheduleDownload';

// Import types
import { Employee, Crew, TaskForEmployeeView } from './types';

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
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(calendarDate);
  const [selectedTab, setSelectedTab] = useState<'employees' | 'crews'>('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  
  // Add state for delete employee confirmation
  const [employeeToDelete, setEmployeeToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // For task assignment
  const [taskAssignee, setTaskAssignee] = useState<string>('');
  const [taskAssigneeCrew, setTaskAssigneeCrew] = useState<string[]>([]);

  // Download dialogs
  const [isEmployeeScheduleDownloadOpen, setIsEmployeeScheduleDownloadOpen] = useState(false);
  const [isCrewScheduleDownloadOpen, setIsCrewScheduleDownloadOpen] = useState(false);
  const [selectedEmployeeForDownload, setSelectedEmployeeForDownload] = useState<{id: string, name: string} | null>(null);

  // Employee operations
  const handleAddEmployee = (newEmployeeData: Omit<Employee, 'id'>) => {
    if (!newEmployeeData.name || !newEmployeeData.position) {
      toast.error("Please fill in all required fields");
      return;
    }

    const employeeId = `e-${Date.now()}`;
    
    const addedEmployee: Employee = {
      id: employeeId,
      ...newEmployeeData
    };

    setEmployees([...employees, addedEmployee]);
    toast.success("New employee has been added");
    setIsAddEmployeeOpen(false);
  };

  // Delete employee handler
  const handleDeleteEmployee = () => {
    if (!employeeToDelete) return;
    
    // Filter out the employee to delete
    const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete.id);
    
    // Update crews to remove employee from any crews they belong to
    const updatedCrews = crews.map(crew => ({
      ...crew,
      members: crew.members.filter(memberId => memberId !== employeeToDelete.id)
    }));
    
    // Update todos to remove assignment to deleted employee
    const updatedTodos = todos.map(todo => {
      if (todo.assignedTo === employeeToDelete.name) {
        return {
          ...todo,
          assignedTo: undefined
        };
      }
      return todo;
    });
    
    // Update state
    setEmployees(updatedEmployees);
    setCrews(updatedCrews);
    setTodos(updatedTodos);
    
    // Close dialog and show success message
    setIsDeleteConfirmOpen(false);
    setEmployeeToDelete(null);
    toast.success(`${employeeToDelete.name} has been removed`);
  };

  // Crew operations
  const handleAddCrew = (newCrewData: Omit<Crew, 'id'>) => {
    if (!newCrewData.name) {
      toast.error("Please provide a crew name");
      return;
    }

    const crewId = `c-${Date.now()}`;
    
    const addedCrew: Crew = {
      id: crewId,
      ...newCrewData
    };

    setCrews([...crews, addedCrew]);
    toast.success("New crew has been created");
    setIsAddCrewOpen(false);
  };

  // Task operations
  const handleCreateTask = (taskData: Omit<TaskForEmployeeView, 'id' | 'completed'>) => {
    if (!taskData.text) {
      toast.error("Please provide a task title");
      return;
    }

    const taskId = `t-${Date.now()}`;
    
    const newTodo = {
      id: taskId,
      text: taskData.text,
      completed: false,
      date: taskData.date,
      assignedTo: taskData.assignedTo,
      assignedToAvatars: taskData.assignedToAvatars,
      crew: taskData.crew,
      location: taskData.location,
      startTime: taskData.startTime,
      endTime: taskData.endTime
    };

    setTodos([...todos, newTodo]);
    setIsTaskDialogOpen(false);
    
    // Reset task assignee
    setTaskAssignee('');
    setTaskAssigneeCrew([]);
    
    toast.success("Task created successfully");
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

  // Helpers
  const openTaskAssignmentForEmployee = (employeeId: string, employeeName: string) => {
    setTaskAssignee(employeeName);
    setTaskAssigneeCrew([]);
    setIsTaskDialogOpen(true);
  };

  const openTaskAssignmentForCrew = (crewId: string, crewName: string) => {
    // Get all employee names in this crew
    const crewMembers = crews.find(c => c.id === crewId)?.members || [];
    const memberNames = crewMembers.map(memberId => {
      const employee = employees.find(e => e.id === memberId);
      return employee ? employee.name : "";
    }).filter(Boolean);

    setTaskAssignee(memberNames.join(", "));
    setTaskAssigneeCrew([crewId]);
    setIsTaskDialogOpen(true);
  };

  // Helper functions
  const getCrewTasks = (crewId: string) => {
    return todos.filter(todo => 
      todo.crew && todo.crew.includes(crewId)
    );
  };

  const getCrewNameById = (crewId: string) => {
    const crew = crews.find(c => c.id === crewId);
    return crew ? crew.name : "";
  };

  const getEmployeeNameById = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : "";
  };

  const getCrewMembersCount = (crewId: string) => {
    const crew = crews.find(c => c.id === crewId);
    return crew ? crew.members.length : 0;
  };

  // Drag and drop handlers
  const handleEmployeeDragStart = (e: React.DragEvent, employee: Employee) => {
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
  
  const handleCrewDragStart = (e: React.DragEvent, crew: Crew) => {
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
              <EmployeeList 
                employees={employees}
                crews={crews}
                searchTerm={searchTerm}
                onHandleEmployeeDragStart={handleEmployeeDragStart}
                onSelectEmployee={setSelectedEmployee}
                onAssignToCrew={(employeeId) => {
                  setSelectedEmployee(employeeId);
                  setIsCrewAssignOpen(true);
                }}
                onScheduleTask={openTaskAssignmentForEmployee}
                onDownloadSchedule={(employee) => {
                  setSelectedEmployeeForDownload(employee);
                  setIsEmployeeScheduleDownloadOpen(true);
                }}
                onDeleteEmployee={(employee) => {
                  setEmployeeToDelete(employee);
                  setIsDeleteConfirmOpen(true);
                }}
                getCrewNameById={getCrewNameById}
              />
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
              <CrewList 
                crews={crews}
                searchTerm={searchTerm}
                onHandleCrewDragStart={handleCrewDragStart}
                onSelectCrew={setSelectedCrew}
                onManageCrew={(crewId) => {
                  setSelectedCrew(crewId);
                  setIsCrewAssignOpen(true);
                }}
                onAssignTask={openTaskAssignmentForCrew}
                onDownloadSchedule={(crewId) => {
                  setSelectedCrew(crewId);
                  setIsCrewScheduleDownloadOpen(true);
                }}
                getCrewTasks={getCrewTasks}
                getEmployeeNameById={getEmployeeNameById}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DownloadCardsSection 
        employees={employees}
        onDownloadEmployeeSchedule={() => {
          if (employees.length > 0) {
            setSelectedEmployeeForDownload({
              id: employees[0].id,
              name: employees[0].name
            });
            setIsEmployeeScheduleDownloadOpen(true);
          } else {
            toast.error("No employees available");
          }
        }}
        onDownloadCrewSchedule={() => setIsCrewScheduleDownloadOpen(true)}
      />

      {/* Dialogs */}
      <AddEmployeeDialog 
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onAddEmployee={handleAddEmployee}
        crews={crews}
        getCrewNameById={getCrewNameById}
      />

      <AddCrewDialog 
        isOpen={isAddCrewOpen}
        onClose={() => setIsAddCrewOpen(false)}
        onAddCrew={handleAddCrew}
        employees={employees}
      />

      <CrewAssignDialog 
        isOpen={isCrewAssignOpen}
        onClose={() => setIsCrewAssignOpen(false)}
        onAssignEmployeeToCrew={handleEmployeeCrewAssignment}
        employees={employees}
        crews={crews}
        selectedEmployee={selectedEmployee}
        selectedCrew={selectedCrew}
        setSelectedEmployee={setSelectedEmployee}
        setSelectedCrew={setSelectedCrew}
      />

      <TaskDialog 
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onCreateTask={handleCreateTask}
        employees={employees}
        crews={crews}
        selectedDate={selectedCalendarDate}
        initialAssignee={taskAssignee}
        initialCrew={taskAssigneeCrew}
        getCrewMembersCount={getCrewMembersCount}
      />

      {/* Employee Delete Confirmation */}
      <EmployeeDeleteDialog 
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onDelete={handleDeleteEmployee}
        employeeName={employeeToDelete?.name || null}
      />

      {/* Employee Schedule Download Dialog */}
      <Dialog open={isEmployeeScheduleDownloadOpen} onOpenChange={setIsEmployeeScheduleDownloadOpen}>
        <DialogContent className="sm:max-w-md">
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
