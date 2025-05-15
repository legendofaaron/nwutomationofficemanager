
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, Calendar } from 'lucide-react';
import { Employee, Crew, Task } from './ScheduleTypes';
import EmployeeScheduleDownload from './EmployeeScheduleDownload';
import CrewScheduleDownload from './CrewScheduleDownload';
import UnifiedScheduleDownload from './UnifiedScheduleDownload';
import { useAppContext } from '@/context/AppContext';

interface ScheduleDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  crews: Crew[];
  tasks: Task[];
  selectedEmployeeId?: string;
  selectedCrewId?: string;
}

const ScheduleDownloadDialog: React.FC<ScheduleDownloadDialogProps> = ({
  isOpen,
  onClose,
  employees,
  crews,
  tasks,
  selectedEmployeeId,
  selectedCrewId
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedEmployeeId ? 'employee' : selectedCrewId ? 'crew' : 'unified');
  
  // Get the global context to access todos
  const { todos } = useAppContext();
  
  // Convert todos to Task format and combine with provided tasks
  const allTasks = [...tasks];
  
  // Get employee name by ID
  const getEmployeeNameById = (employeeId?: string): string => {
    if (!employeeId) return "";
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };
  
  useEffect(() => {
    // Convert todos to tasks format
    const todoTasks: Task[] = todos.map(todo => ({
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
    
    // Add todo tasks to allTasks, avoiding duplicates
    todoTasks.forEach(todoTask => {
      if (!allTasks.some(t => t.id === todoTask.id)) {
        allTasks.push(todoTask);
      }
    });
  }, [todos]);
  
  // Close dialog handler
  const handleClose = () => {
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Download Schedule</DialogTitle>
          <DialogDescription>
            Download schedules for employees, crews, or the complete schedule
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unified" className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              All
            </TabsTrigger>
            <TabsTrigger value="employee" className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              Employee
            </TabsTrigger>
            <TabsTrigger value="crew" className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Crew
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unified">
            <UnifiedScheduleDownload
              employees={employees}
              crews={crews}
              tasks={allTasks}
              onClose={handleClose}
              defaultSelectedEmployeeId={selectedEmployeeId}
              defaultSelectedCrewId={selectedCrewId} 
              defaultTab={selectedEmployeeId ? 'employee' : selectedCrewId ? 'crew' : 'all'}
            />
          </TabsContent>
          
          <TabsContent value="employee">
            {selectedEmployeeId ? (
              <EmployeeScheduleDownload
                employeeId={selectedEmployeeId}
                employeeName={getEmployeeNameById(selectedEmployeeId)}
                tasks={allTasks}
                onClose={handleClose}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                Please select an employee first
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="crew">
            <CrewScheduleDownload
              crews={crews}
              tasks={allTasks}
              selectedCrewId={selectedCrewId}
              onClose={handleClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDownloadDialog;
