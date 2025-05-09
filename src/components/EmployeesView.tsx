import React, { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import EmployeeList from './employees/EmployeeList';
import CrewList from './employees/CrewList';
import AddEmployeeDialog from './employees/AddEmployeeDialog';
import AddCrewDialog from './employees/AddCrewDialog';
import EmployeeDeleteDialog from './employees/EmployeeDeleteDialog';
import CrewDeleteDialog from './employees/CrewDeleteDialog';
import CrewAssignDialog from './employees/CrewAssignDialog';
import DownloadCardsSection from './employees/DownloadCardsSection';
import { Employee, Crew } from './schedule/ScheduleTypes';
import { DragDropProvider } from './schedule/DragDropContext';

const EmployeesView = React.memo(() => {
  const { employees, setEmployees, crews, setCrews } = useAppContext();
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddCrewOpen, setIsAddCrewOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isEditCrewOpen, setIsEditCrewOpen] = useState(false);
  const [isDeleteEmployeeOpen, setIsDeleteEmployeeOpen] = useState(false);
  const [isDeleteCrewOpen, setIsDeleteCrewOpen] = useState(false);
  const [isAssignCrewOpen, setIsAssignCrewOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [currentCrew, setCurrentCrew] = useState<Crew | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [filteredCrews, setFilteredCrews] = useState<Crew[]>([]);

  // Filter employees and crews based on search query
  useEffect(() => {
    if (employees) {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (employee.position?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      );
      setFilteredEmployees(filtered);
    }

    if (crews) {
      const filtered = crews.filter(crew =>
        crew.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCrews(filtered);
    }
  }, [searchQuery, employees, crews]);

  // Add employee handler
  const handleAddEmployee = useCallback((employeeData: Employee) => {
    setEmployees([...(employees || []), employeeData]);
    setIsAddEmployeeOpen(false);
  }, [employees, setEmployees]);

  // Add crew handler
  const handleAddCrew = useCallback((crewData: Crew) => {
    setCrews([...(crews || []), crewData]);
    setIsAddCrewOpen(false);
  }, [crews, setCrews]);

  // Edit employee handler
  const handleEditEmployee = useCallback((employeeData: Employee) => {
    setCurrentEmployee(employeeData);
    setIsEditEmployeeOpen(true);
  }, []);

  // Save edited employee
  const handleSaveEmployee = useCallback((editedEmployee: Employee) => {
    setEmployees(
      employees?.map(emp => (emp.id === editedEmployee.id ? editedEmployee : emp)) || []
    );
    setIsEditEmployeeOpen(false);
    setCurrentEmployee(null);
  }, [employees, setEmployees]);

  // Edit crew handler
  const handleEditCrew = useCallback((crewData: Crew) => {
    setCurrentCrew(crewData);
    setIsEditCrewOpen(true);
  }, []);
  
  // Save edited crew
  const handleSaveCrew = useCallback((editedCrew: Crew) => {
    setCrews(
      crews?.map(crew => (crew.id === editedCrew.id ? editedCrew : crew)) || []
    );
    setIsEditCrewOpen(false);
    setCurrentCrew(null);
  }, [crews, setCrews]);

  // Delete employee handler
  const handleDeleteEmployeeRequest = useCallback((employeeId: string, employeeName: string) => {
    setCurrentEmployee({ id: employeeId, name: employeeName } as Employee);
    setIsDeleteEmployeeOpen(true);
  }, []);

  // Confirm employee deletion
  const handleConfirmDeleteEmployee = useCallback(() => {
    if (currentEmployee) {
      setEmployees(employees?.filter(emp => emp.id !== currentEmployee.id) || []);
    }
    setIsDeleteEmployeeOpen(false);
    setCurrentEmployee(null);
  }, [currentEmployee, employees, setEmployees]);

  // Delete crew handler
  const handleDeleteCrewRequest = useCallback((crewId: string, crewName: string) => {
    setCurrentCrew({ id: crewId, name: crewName, members: [] } as Crew);
    setIsDeleteCrewOpen(true);
  }, []);

  // Confirm crew deletion
  const handleConfirmDeleteCrew = useCallback(() => {
    if (currentCrew) {
      setCrews(crews?.filter(crew => crew.id !== currentCrew.id) || []);
    }
    setIsDeleteCrewOpen(false);
    setCurrentCrew(null);
  }, [currentCrew, crews, setCrews]);

  // Assign crew handler
  const handleAssignCrewRequest = useCallback((crewId: string) => {
    const crew = crews?.find(c => c.id === crewId);
    setCurrentCrew(crew || null);
    setIsAssignCrewOpen(true);
  }, [crews]);

  // Save crew assignments - fix the callback signature to match the expected type
  const handleSaveCrewAssignments = useCallback((crewId: string, memberIds: string[]) => {
    if (crews) {
      const updatedCrews = crews.map(crew => 
        crew.id === crewId ? { ...crew, members: memberIds } : crew
      );
      setCrews(updatedCrews);
    }
    setIsAssignCrewOpen(false);
  }, [crews, setCrews]);

  // Mock handlers for props that we need to pass but aren't using in this component
  const handleDragStart = useCallback(() => {}, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);
  const handleSelectEmployee = useCallback(() => {}, []);
  const handleAssignTask = useCallback(() => {}, []);
  const handleDownloadSchedule = useCallback((id: string) => {}, []);
  const getEmployeeCrews = useCallback(() => [] as string[], []);
  const getEmployeeTasks = useCallback(() => [], []);
  const getCrewTasks = useCallback(() => [], []);
  const getEmployeeNameById = useCallback(() => '', []);

  return (
    <DragDropProvider>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Employees & Crews</h2>
            <p className="text-muted-foreground mt-1">Manage your workforce and team organization</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setIsAddEmployeeOpen(true)}>
              Add Employee
            </Button>
            <Button variant="outline" onClick={() => setIsAddCrewOpen(true)}>
              Add Crew
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees or crews..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="crews">Crews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees">
            <EmployeeList 
              employees={filteredEmployees}
              searchTerm=""
              onHandleEmployeeDragStart={handleDragStart}
              onSelectEmployee={handleSelectEmployee}
              onEditEmployee={handleEditEmployee}
              onDeleteEmployee={handleDeleteEmployeeRequest}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onAssignTask={handleAssignTask}
              onDownloadSchedule={handleDownloadSchedule}
              getEmployeeCrews={getEmployeeCrews}
              getEmployeeTasks={getEmployeeTasks}
            />
          </TabsContent>
          
          <TabsContent value="crews">
            <CrewList 
              crews={filteredCrews}
              searchTerm=""
              onHandleCrewDragStart={handleDragStart}
              onSelectCrew={handleSelectEmployee}
              onManageCrew={handleAssignCrewRequest}
              onDeleteCrew={handleDeleteCrewRequest}
              onAssignTask={(crewId: string, crewName: string) => {}}
              onDownloadSchedule={handleDownloadSchedule}
              getCrewTasks={getCrewTasks}
              getEmployeeNameById={getEmployeeNameById}
            />
          </TabsContent>
        </Tabs>
        
        <DownloadCardsSection 
          employees={employees || []}
          crews={crews}
          onDownloadEmployeeSchedule={() => {}}
          onDownloadCrewSchedule={() => {}}
        />

        {/* Dialogs */}
        <AddEmployeeDialog
          isOpen={isAddEmployeeOpen}
          onClose={() => setIsAddEmployeeOpen(false)}
          onAddEmployee={handleAddEmployee}
          crews={crews || []}
          employee={null}
        />
        
        {/* Same dialog is reused for editing with prefilled data */}
        <AddEmployeeDialog
          isOpen={isEditEmployeeOpen}
          onClose={() => setIsEditEmployeeOpen(false)}
          onAddEmployee={handleSaveEmployee}
          employee={currentEmployee}
          crews={crews || []}
        />
        
        <AddCrewDialog
          isOpen={isAddCrewOpen}
          onClose={() => setIsAddCrewOpen(false)}
          onAddCrew={handleAddCrew}
          employees={employees || []}
        />
        
        {/* Same dialog is reused for editing with prefilled data */}
        <AddCrewDialog
          isOpen={isEditCrewOpen}
          onClose={() => setIsEditCrewOpen(false)}
          onAddCrew={handleSaveCrew}
          employees={employees || []}
        />
        
        <EmployeeDeleteDialog
          isOpen={isDeleteEmployeeOpen}
          onClose={() => setIsDeleteEmployeeOpen(false)}
          onDelete={handleConfirmDeleteEmployee}
          employeeName={currentEmployee?.name || null}
        />
        
        <CrewDeleteDialog
          isOpen={isDeleteCrewOpen}
          onClose={() => setIsDeleteCrewOpen(false)}
          onDelete={handleConfirmDeleteCrew}
          crewName={currentCrew?.name || null}
        />
        
        <CrewAssignDialog
          isOpen={isAssignCrewOpen}
          onClose={() => setIsAssignCrewOpen(false)}
          selectedCrew={currentCrew}
          employees={employees || []}
          onSave={handleSaveCrewAssignments}
        />
      </div>
    </DragDropProvider>
  );
});

EmployeesView.displayName = 'EmployeesView';

export default EmployeesView;
