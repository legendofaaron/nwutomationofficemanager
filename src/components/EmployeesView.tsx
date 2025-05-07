
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
import { EmployeeData, CrewData } from './employees/types';
import { DragDropProvider } from './schedule/DragDropContext';

const EmployeesView = () => {
  const { employees, setEmployees, crews, setCrews } = useAppContext();
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddCrewOpen, setIsAddCrewOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isEditCrewOpen, setIsEditCrewOpen] = useState(false);
  const [isDeleteEmployeeOpen, setIsDeleteEmployeeOpen] = useState(false);
  const [isDeleteCrewOpen, setIsDeleteCrewOpen] = useState(false);
  const [isAssignCrewOpen, setIsAssignCrewOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeData | null>(null);
  const [currentCrew, setCurrentCrew] = useState<CrewData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeData[]>([]);
  const [filteredCrews, setFilteredCrews] = useState<CrewData[]>([]);

  // Filter employees and crews based on search query
  useEffect(() => {
    if (employees) {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchQuery.toLowerCase())
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
  const handleAddEmployee = useCallback((employeeData: EmployeeData) => {
    setEmployees([...(employees || []), employeeData]);
    setIsAddEmployeeOpen(false);
  }, [employees, setEmployees]);

  // Add crew handler
  const handleAddCrew = useCallback((crewData: CrewData) => {
    setCrews([...(crews || []), crewData]);
    setIsAddCrewOpen(false);
  }, [crews, setCrews]);

  // Edit employee handler
  const handleEditEmployee = useCallback((employeeData: EmployeeData) => {
    setCurrentEmployee(employeeData);
    setIsEditEmployeeOpen(true);
  }, []);

  // Save edited employee
  const handleSaveEmployee = useCallback((editedEmployee: EmployeeData) => {
    setEmployees(
      employees?.map(emp => (emp.id === editedEmployee.id ? editedEmployee : emp)) || []
    );
    setIsEditEmployeeOpen(false);
    setCurrentEmployee(null);
  }, [employees, setEmployees]);

  // Edit crew handler
  const handleEditCrew = useCallback((crewData: CrewData) => {
    setCurrentCrew(crewData);
    setIsEditCrewOpen(true);
  }, []);
  
  // Save edited crew
  const handleSaveCrew = useCallback((editedCrew: CrewData) => {
    setCrews(
      crews?.map(crew => (crew.id === editedCrew.id ? editedCrew : crew)) || []
    );
    setIsEditCrewOpen(false);
    setCurrentCrew(null);
  }, [crews, setCrews]);

  // Delete employee handler
  const handleDeleteEmployeeRequest = useCallback((employeeData: EmployeeData) => {
    setCurrentEmployee(employeeData);
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
  const handleDeleteCrewRequest = useCallback((crewData: CrewData) => {
    setCurrentCrew(crewData);
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
  const handleAssignCrewRequest = useCallback((crewData: CrewData) => {
    setCurrentCrew(crewData);
    setIsAssignCrewOpen(true);
  }, []);

  // Save crew assignments
  const handleSaveCrewAssignments = useCallback((crewId: string, memberIds: string[]) => {
    setCrews(prevCrews => 
      prevCrews?.map(crew => 
        crew.id === crewId 
          ? { ...crew, members: memberIds }
          : crew
      ) || []
    );
    setIsAssignCrewOpen(false);
  }, [setCrews]);

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
              onEditEmployee={handleEditEmployee}
              onDeleteEmployee={handleDeleteEmployeeRequest}
            />
          </TabsContent>
          
          <TabsContent value="crews">
            <CrewList 
              crews={filteredCrews}
              employees={employees || []}
              onEditCrew={handleEditCrew}
              onDeleteCrew={handleDeleteCrewRequest}
              onAssignCrew={handleAssignCrewRequest}
            />
          </TabsContent>
        </Tabs>
        
        <DownloadCardsSection employees={employees || []} crews={crews || []} />

        {/* Dialogs */}
        <AddEmployeeDialog
          open={isAddEmployeeOpen}
          onOpenChange={setIsAddEmployeeOpen}
          onAddEmployee={handleAddEmployee}
        />
        
        {/* Same dialog is reused for editing with prefilled data */}
        <AddEmployeeDialog
          open={isEditEmployeeOpen}
          onOpenChange={setIsEditEmployeeOpen}
          onAddEmployee={handleSaveEmployee}
          employeeData={currentEmployee}
          isEditing={true}
        />
        
        <AddCrewDialog
          open={isAddCrewOpen}
          onOpenChange={setIsAddCrewOpen}
          onAddCrew={handleAddCrew}
        />
        
        {/* Same dialog is reused for editing with prefilled data */}
        <AddCrewDialog
          open={isEditCrewOpen}
          onOpenChange={setIsEditCrewOpen}
          onAddCrew={handleSaveCrew}
          crewData={currentCrew}
          isEditing={true}
        />
        
        <EmployeeDeleteDialog
          open={isDeleteEmployeeOpen}
          onOpenChange={setIsDeleteEmployeeOpen}
          onDeleteConfirm={handleConfirmDeleteEmployee}
          employee={currentEmployee}
        />
        
        <CrewDeleteDialog
          open={isDeleteCrewOpen}
          onOpenChange={setIsDeleteCrewOpen}
          onDeleteConfirm={handleConfirmDeleteCrew}
          crew={currentCrew}
        />
        
        <CrewAssignDialog
          open={isAssignCrewOpen}
          onOpenChange={setIsAssignCrewOpen}
          crew={currentCrew}
          employees={employees || []}
          onSave={handleSaveCrewAssignments}
        />
      </div>
    </DragDropProvider>
  );
};

export default EmployeesView;
