
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task, Employee, Crew } from './ScheduleTypes';
import UnifiedScheduleDownload from './UnifiedScheduleDownload';

interface ScheduleDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  employees: Employee[];
  crews: Crew[];
  selectedEmployeeId?: string;
  selectedCrewId?: string;
  defaultTab?: 'employee' | 'crew';
}

const ScheduleDownloadDialog: React.FC<ScheduleDownloadDialogProps> = ({
  isOpen,
  onClose,
  tasks,
  employees,
  crews,
  selectedEmployeeId,
  selectedCrewId,
  defaultTab
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Download Schedule</DialogTitle>
          <DialogDescription>
            Select an employee or crew and date range to download the schedule
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <UnifiedScheduleDownload
            employees={employees}
            crews={crews}
            tasks={tasks}
            onClose={onClose}
            defaultSelectedEmployeeId={selectedEmployeeId}
            defaultSelectedCrewId={selectedCrewId}
            defaultTab={defaultTab}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDownloadDialog;
