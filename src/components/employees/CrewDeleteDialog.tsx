
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

interface CrewDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  crewName: string | null;
}

const CrewDeleteDialog: React.FC<CrewDeleteDialogProps> = ({
  isOpen,
  onClose,
  onDelete,
  crewName
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {crewName ? (
              <>
                You are about to delete the <span className="font-semibold">{crewName}</span> crew. 
                This action cannot be undone. The crew will be removed from all task assignments.
              </>
            ) : (
              'You are about to delete this crew. This action cannot be undone.'
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

export default CrewDeleteDialog;
