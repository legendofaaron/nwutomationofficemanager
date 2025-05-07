import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Search, Plus, RefreshCw } from 'lucide-react';
import EmployeeList from './EmployeeList';
import CrewList from './CrewList';
import AddEmployeeDialog from './AddEmployeeDialog';
import AddCrewDialog from './AddCrewDialog';
import CrewAssignDialog from './CrewAssignDialog';
import TaskDialog from './TaskDialog';
import DownloadCardsSection from './DownloadCardsSection';
import { Employee, Crew, TaskForEmployeeView } from './types';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import CrewDeleteDialog from './CrewDeleteDialog';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CrewScheduleDownload from '../schedule/CrewScheduleDownload';
import EmployeeScheduleDownload from '../schedule/EmployeeScheduleDownload';

const EmployeesView: React.FC = () => {
  // State variables
  const { employees, setEmployees, crews, setCrews, todos, setTodos } = useAppContext();
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [crewSearchTerm, setCrewSearchTerm] = useState('');
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isAddCrewDialogOpen, setIsAddCrewDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleteEmployeeDialogOpen, setIsDeleteEmployeeDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isCrewAssignDialogOpen, setIsCrewAssignDialogOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskAssignee, setTaskAssignee] = useState<string | null>(null);
  const [isDeleteCrewDialogOpen, setIsDeleteCrewDialogOpen] = useState(false);
  const [crewToDelete, setCrewToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isCrewScheduleDialogOpen, setIsCrewScheduleDialogOpen] = useState(false);
  const [isEmployeeScheduleDialogOpen, setIsEmployeeScheduleDialogOpen] = useState(false);
  const [selectedCrewForSchedule, setSelectedCrewForSchedule] = useState<string | null>(null);
  const [selectedEmployeeForSchedule, setSelectedEmployeeForSchedule] = useState<string | null>(null);

  // Handlers and utility functions
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsAddEmployeeDialogOpen(true);
  };

  const handleAddCrew = () => {
    setIsAddCrewDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsAddEmployeeDialogOpen(true);
  };

  const handleDeleteEmployee = (employeeId: string, employeeName: string) => {
    setEmployeeToDelete({ id: employeeId, name: employeeName });
    setIsDeleteEmployeeDialogOpen(true);
  };

  const confirmDeleteEmployee = () => {
    if (!employeeToDelete) return;

    try {
      // Remove employee from the list
      const updatedEmployees = employees.filter(employee => employee.id !== employeeToDelete.id);
      setEmployees(updatedEmployees);

      // Remove employee from crew assignments
      const updatedCrews = crews.map(crew => ({
        ...crew,
        members: crew.members.filter(memberId => memberId !== employeeToDelete.id)
      }));
      setCrews(updatedCrews);

      // Remove employee assignments from tasks
      const updatedTodos = todos.map(todo => {
        if (todo.assignedTo === employeeToDelete.name) {
          return { ...todo, assignedTo: undefined, assignedToAvatars: undefined };
        }
        return todo;
      });
      setTodos(updatedTodos);

      toast.success(`Employee "${employeeToDelete.name}" was deleted successfully`);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    } finally {
      setIsDeleteEmployeeDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSelectEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
    }
  };

  const handleManageCrew = (crewId: string) => {
    const crew = crews.find(crew => crew.id === crewId);
    setSelectedCrew(crew || null);
    setIsCrewAssignDialogOpen(true);
  };

  const handleSaveCrewAssignments = (crewId: string, memberIds: string[]) => {
    const updatedCrews = crews.map(crew =>
      crew.id === crewId ? { ...crew, members: memberIds } : crew
    );
    setCrews(updatedCrews);
    setIsCrewAssignDialogOpen(false);
    toast.success('Crew assignments saved successfully');
  };

  const handleOpenAssignTaskDialog = (employeeName: string) => {
    setTaskAssignee(employeeName);
    setIsTaskDialogOpen(true);
  };

  const handleOpenAssignTaskToCrew = (crewId: string, crewName: string) => {
    setTaskAssignee(crewName);
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = (taskText: string) => {
    const newTask = {
      id: uuidv4(),
      text: taskText,
      completed: false,
      date: new Date(),
      assignedTo: taskAssignee,
    };
    setTodos([...todos, newTask]);
    setIsTaskDialogOpen(false);
    toast.success('Task assigned successfully');
  };

  const handleEmployeeDragStart = (e: React.DragEvent, employee: Employee) => {
    e.dataTransfer.setData('employeeId', employee.id);
  };

  const handleCrewDragStart = (e: React.DragEvent, crew: Crew) => {
    e.dataTransfer.setData('crewId', crew.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const employeeId = e.dataTransfer.getData('employeeId');
    const crewId = e.dataTransfer.getData('crewId');

    if (employeeId && selectedCrew) {
      if (!selectedCrew.members.includes(employeeId)) {
        const updatedCrews = crews.map(crew =>
          crew.id === selectedCrew.id ? { ...crew, members: [...crew.members, employeeId] } : crew
        );
        setCrews(updatedCrews);
        toast.success('Employee added to crew successfully');
      } else {
        toast.warning('Employee is already in this crew');
      }
    } else if (crewId && selectedEmployee) {
      const crew = crews.find(crew => crew.id === crewId);
      if (crew && !crew.members.includes(selectedEmployee.id)) {
        const updatedCrews = crews.map(c =>
          c.id === crewId ? { ...c, members: [...c.members, selectedEmployee.id] } : c
        );
        setCrews(updatedCrews);
        toast.success('Crew member added successfully');
      } else {
        toast.warning('Crew member is already assigned');
      }
    }
  };

  const confirmAddEmployee = (employee: Employee) => {
    if (employee.id) {
      // Update existing employee
      const updatedEmployees = employees.map(e => (e.id === employee.id ? employee : e));
      setEmployees(updatedEmployees);
      toast.success('Employee updated successfully');
    } else {
      // Add new employee
      const newEmployee = { ...employee, id: uuidv4() };
      setEmployees([...employees, newEmployee]);
      toast.success('Employee added successfully');
    }
    setIsAddEmployeeDialogOpen(false);
  };

  const confirmAddCrew = (newCrew: Omit<Crew, "id">) => {
    const crewWithId = {
      id: uuidv4(),
      name: newCrew.name,
      members: newCrew.members,
    };
    setCrews([...crews, crewWithId]);
    setIsAddCrewDialogOpen(false);
    toast.success('Crew added successfully');
  };

  const getCrewNamesByEmployeeId = (employeeId: string): string[] => {
    const employeeCrews = crews.filter(crew => crew.members.includes(employeeId));
    return employeeCrews.map(crew => crew.name);
  };

  const getTodosByEmployeeId = (employeeId: string): TaskForEmployeeView[] => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return [];
    
    return todos.filter(todo => todo.assignedTo === employee.name).map(todo => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      date: todo.date,
    }));
  };

  const getTodosByCrewId = (crewId: string): TaskForEmployeeView[] => {
    return todos.filter(todo => {
      // Check both crew array and crewId property for backward compatibility
      return (todo.crew && todo.crew.includes(crewId)) || todo.crew?.[0] === crewId;
    }).map(todo => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      date: todo.date,
    }));
  };

  const getEmployeeNameById = (employeeId: string): string => {
    const employee = employees.find(employee => employee.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  const generateRandomData = () => {
    // Generate a random number of employees
    const numEmployees = Math.floor(Math.random() * 5) + 2; // Random number between 2 and 6

    // Generate random employees
    const newEmployees = Array.from({ length: numEmployees }, () => ({
      id: uuidv4(),
      name: `Employee ${Math.floor(Math.random() * 100)}`,
      position: 'Developer',
      email: `employee${Math.floor(Math.random() * 100)}@example.com`,
    }));

    // Update the employees state
    setEmployees(newEmployees);

    // Generate a random number of crews
    const numCrews = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3

    // Generate random crews
    const newCrews = Array.from({ length: numCrews }, () => ({
      id: uuidv4(),
      name: `Crew ${Math.floor(Math.random() * 100)}`,
      members: newEmployees.map(employee => employee.id),
    }));

    // Update the crews state
    setCrews(newCrews);

    toast.success('Random data generated successfully');
  };

  // Add a handler for crew deletion
  const handleDeleteCrew = (crewId: string, crewName: string) => {
    setCrewToDelete({ id: crewId, name: crewName });
    setIsDeleteCrewDialogOpen(true);
  };

  const confirmDeleteCrew = () => {
    if (!crewToDelete) return;

    try {
      // Remove crew from the list
      const updatedCrews = crews.filter(crew => crew.id !== crewToDelete.id);
      setCrews(updatedCrews);
      
      // Remove crew from employee associations
      const updatedEmployees = employees.map(employee => {
        if (employee.crews && employee.crews.includes(crewToDelete.id)) {
          return {
            ...employee,
            crews: employee.crews.filter(id => id !== crewToDelete.id)
          };
        }
        return employee;
      });
      setEmployees(updatedEmployees);
      
      // Remove crew assignments from tasks
      const updatedTodos = todos.map(todo => {
        // Check both crew array and crewId property for backward compatibility
        if ((todo.crew && todo.crew.includes(crewToDelete.id)) || 
            (todo.crew?.[0] === crewToDelete.id)) {
          // Create a new object without the crew-related properties
          const { crew, ...rest } = todo;
          return rest;
        }
        return todo;
      });
      setTodos(updatedTodos);
      
      toast.success(`Crew "${crewToDelete.name}" was deleted successfully`);
    } catch (error) {
      console.error("Error deleting crew:", error);
      toast.error("Failed to delete crew");
    } finally {
      setIsDeleteCrewDialogOpen(false);
      setCrewToDelete(null);
    }
  };

  // Add handlers for schedule downloads
  const handleOpenCrewSchedule = (crewId: string) => {
    console.log("Opening crew schedule for:", crewId);
    setSelectedCrewForSchedule(crewId);
    setIsCrewScheduleDialogOpen(true);
  };

  const handleOpenEmployeeSchedule = (employeeId: string) => {
    console.log("Opening employee schedule for:", employeeId);
    setSelectedEmployeeForSchedule(employeeId);
    setIsEmployeeScheduleDialogOpen(true);
  };

  // Update handlers for download buttons
  const handleDownloadEmployeeSchedule = () => {
    setIsEmployeeScheduleDialogOpen(true);
  };
  
  const handleDownloadCrewSchedule = () => {
    setIsCrewScheduleDialogOpen(true);
  };

  // Convert todos to the format expected by schedule components
  const convertTodosToTasks = (): any[] => {
    console.log("Converting todos to tasks, count:", todos.length);
    return todos.map(todo => ({
      id: todo.id,
      title: todo.text || "Untitled Task", // Use text as the title if available
      text: todo.text, // Ensure text property is set
      date: todo.date instanceof Date ? todo.date : new Date(todo.date || new Date()),
      completed: !!todo.completed,
      assignedTo: todo.assignedTo,
      crew: todo.crew || [],
      crewId: todo.crewId || (todo.crew && todo.crew[0]), // Use crewId or first item in crew array
      startTime: todo.startTime || "09:00",
      endTime: todo.endTime || "17:00",
      location: todo.location || "Office",
      clientId: todo.clientId || undefined,
      clientLocationId: todo.clientLocationId || undefined,
      description: todo.description || todo.text || "" // Ensure description is populated
    }));
  };

  useEffect(() => {
    // You can add any side effects here, like fetching data from an API
  }, []);

  return (
    <div className="container py-6 space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Employees & Crews</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={generateRandomData}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" /> Generate Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="crews">Crews</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="w-full pl-8"
                value={employeeSearchTerm}
                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddEmployee} className="gap-1">
              <Plus className="h-4 w-4" /> Add Employee
            </Button>
          </div>

          <EmployeeList
            employees={employees}
            searchTerm={employeeSearchTerm}
            onHandleEmployeeDragStart={handleEmployeeDragStart}
            onSelectEmployee={handleSelectEmployee}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onAssignTask={handleOpenAssignTaskDialog}
            onDownloadSchedule={handleOpenEmployeeSchedule}
            getEmployeeCrews={(employeeId: string) =>
              getCrewNamesByEmployeeId(employeeId)
            }
            getEmployeeTasks={(employeeId: string) =>
              getTodosByEmployeeId(employeeId)
            }
          />
        </TabsContent>

        <TabsContent value="crews" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search crews..."
                className="w-full pl-8"
                value={crewSearchTerm}
                onChange={(e) => setCrewSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddCrew} className="gap-1">
              <Plus className="h-4 w-4" /> Add Crew
            </Button>
          </div>

          <CrewList
            crews={crews}
            searchTerm={crewSearchTerm}
            onHandleCrewDragStart={handleCrewDragStart}
            onSelectCrew={handleSelectEmployee}
            onManageCrew={handleManageCrew}
            onAssignTask={handleOpenAssignTaskToCrew}
            onDownloadSchedule={handleOpenCrewSchedule}
            onDeleteCrew={handleDeleteCrew}
            getCrewTasks={(crewId: string) => getTodosByCrewId(crewId)}
            getEmployeeNameById={(employeeId: string) =>
              getEmployeeNameById(employeeId)
            }
          />
        </TabsContent>
      </Tabs>

      <DownloadCardsSection 
        employees={employees} 
        onDownloadEmployeeSchedule={handleDownloadEmployeeSchedule}
        onDownloadCrewSchedule={handleDownloadCrewSchedule}
      />

      {/* Keep existing dialogs */}
      <AddEmployeeDialog
        isOpen={isAddEmployeeDialogOpen}
        onClose={() => setIsAddEmployeeDialogOpen(false)}
        employee={editingEmployee}
        onAddEmployee={confirmAddEmployee}
        crews={crews}
      />

      <AddCrewDialog
        isOpen={isAddCrewDialogOpen}
        onClose={() => setIsAddCrewDialogOpen(false)}
        onAddCrew={confirmAddCrew}
        employees={employees}
      />

      <CrewAssignDialog
        isOpen={isCrewAssignDialogOpen}
        onClose={() => setIsCrewAssignDialogOpen(false)}
        selectedCrew={selectedCrew}
        employees={employees}
        onSave={handleSaveCrewAssignments}
      />

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        taskAssignee={taskAssignee}
        onSave={handleSaveTask}
      />

      <EmployeeDeleteDialog 
        isOpen={isDeleteEmployeeDialogOpen}
        onClose={() => setIsDeleteEmployeeDialogOpen(false)}
        onDelete={confirmDeleteEmployee}
        employeeName={employeeToDelete?.name || null}
      />

      {/* Add the CrewDeleteDialog */}
      <CrewDeleteDialog
        isOpen={isDeleteCrewDialogOpen}
        onClose={() => setIsDeleteCrewDialogOpen(false)}
        onDelete={confirmDeleteCrew}
        crewName={crewToDelete?.name || null}
      />

      {/* Add schedule download dialogs */}
      <Dialog open={isCrewScheduleDialogOpen} onOpenChange={setIsCrewScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <CrewScheduleDownload
            crews={selectedCrewForSchedule ? crews.filter(c => c.id === selectedCrewForSchedule) : crews}
            tasks={convertTodosToTasks()}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEmployeeScheduleDialogOpen} onOpenChange={setIsEmployeeScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <EmployeeScheduleDownload
            employeeId={selectedEmployeeForSchedule || ""}
            employeeName={selectedEmployeeForSchedule ? getEmployeeNameById(selectedEmployeeForSchedule) : ""}
            tasks={convertTodosToTasks()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesView;
