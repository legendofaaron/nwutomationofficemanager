
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users } from 'lucide-react';
import { Employee, Crew, Task } from './ScheduleTypes';
import EmployeeScheduleDownload from './EmployeeScheduleDownload';
import CrewScheduleDownload from './CrewScheduleDownload';
import UnifiedScheduleDownload from './UnifiedScheduleDownload';

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
  
  // Get employee name by ID
  const getEmployeeNameById = (employeeId?: string): string => {
    if (!employeeId) return "";
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };
  
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
            Download schedules for employees or crews
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unified" className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Any
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
              tasks={tasks}
              onClose={handleClose}
              defaultSelectedEmployeeId={selectedEmployeeId}
              defaultSelectedCrewId={selectedCrewId} 
              defaultTab={selectedEmployeeId ? 'employee' : 'crew'}
            />
          </TabsContent>
          
          <TabsContent value="employee">
            {selectedEmployeeId ? (
              <EmployeeScheduleDownload
                employeeId={selectedEmployeeId}
                employeeName={getEmployeeNameById(selectedEmployeeId)}
                tasks={tasks}
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
              tasks={tasks}
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
