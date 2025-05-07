
import { useEffect } from 'react';
import { DroppedItem } from '../CalendarTypes';
import { TaskFormValues } from '../CalendarTypes';
import { UseFormReturn } from 'react-hook-form';

interface DialogHandlersProps {
  droppedItem: DroppedItem | null;
  setDroppedItem: (item: DroppedItem | null) => void;
  setEmployeeTaskDialogOpen: (open: boolean) => void;
  setCrewTaskDialogOpen: (open: boolean) => void;
  employeeTaskForm: UseFormReturn<TaskFormValues>;
  crewTaskForm: UseFormReturn<TaskFormValues>;
}

export const useDialogHandlers = ({
  droppedItem,
  setDroppedItem,
  setEmployeeTaskDialogOpen,
  setCrewTaskDialogOpen,
  employeeTaskForm,
  crewTaskForm
}: DialogHandlersProps) => {
  
  // Handle opening employee dialog when employee is dropped
  const handleEmployeeTaskDialogOpen = (item: DroppedItem, date: Date) => {
    setDroppedItem(item);
    employeeTaskForm.setValue('date', date);
    setEmployeeTaskDialogOpen(true);
  };
  
  // Handle opening crew dialog when crew is dropped
  const handleCrewTaskDialogOpen = (item: DroppedItem, date: Date) => {
    setDroppedItem(item);
    crewTaskForm.setValue('date', date);
    setCrewTaskDialogOpen(true);
  };
  
  return {
    handleEmployeeTaskDialogOpen,
    handleCrewTaskDialogOpen
  };
};
