
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export const Logo = () => {
  const { setFiles, setCurrentFile, setViewMode } = useAppContext();
  const { toast } = useToast();

  const handleDeleteAllFiles = () => {
    setFiles([]);
    setCurrentFile(null);
    setViewMode('files');
    toast({
      title: "All files deleted",
      description: "All files have been removed",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <Trash2 className="h-6 w-6 text-gray-500" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your files
              and remove your data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllFiles}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Link to="/" className="font-semibold text-app-blue">
        NorthWestern AI
      </Link>
    </div>
  );
};
