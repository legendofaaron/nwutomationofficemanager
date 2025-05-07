
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EmployeeDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  employeeName: string | null;
}

const EmployeeDeleteDialog: React.FC<EmployeeDeleteDialogProps> = ({
  isOpen,
  onClose,
  onDelete,
  employeeName
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {employeeName ? (
              <>
                You are about to delete <span className="font-semibold">{employeeName}</span>. 
                This action cannot be undone. The employee will be removed from all crews and tasks.
              </>
            ) : (
              'You are about to delete this employee. This action cannot be undone.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmployeeDeleteDialog;
