
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TaskEditDialog from '@/components/schedule/taskEdit/TaskEditDialog';
import { Task } from '@/components/schedule/ScheduleTypes';

interface TaskEditDialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  crews: any[];
  employees: any[];
  clients: any[];
  clientLocations: any[];
  onSaveChanges: (taskId: string, updatedData: Partial<Task>) => void;
}

const TaskEditDialogWrapper: React.FC<TaskEditDialogWrapperProps> = ({
  open,
  onOpenChange,
  task,
  crews,
  employees,
  clients,
  clientLocations,
  onSaveChanges
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <TaskEditDialog
          open={open}
          onOpenChange={onOpenChange}
          onSaveChanges={onSaveChanges}
          task={task}
          crews={crews}
          employees={employees}
          clients={clients}
          clientLocations={clientLocations}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialogWrapper;
