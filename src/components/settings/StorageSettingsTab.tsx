
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
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
import { Trash2, File } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export const StorageSettingsTab = () => {
  const { files, setFiles } = useAppContext();

  const handlePermanentDelete = (fileId: string, fileName: string) => {
    // Find and delete the file from the files array
    const deleteFileRecursively = (files: any[], targetId: string): any[] => {
      return files.filter(file => {
        if (file.id === targetId) {
          return false;
        }
        if (file.children) {
          file.children = deleteFileRecursively(file.children, targetId);
        }
        return true;
      });
    };
    
    const updatedFiles = deleteFileRecursively([...files], fileId);
    setFiles(updatedFiles);
    
    toast({
      title: "File Deleted",
      description: `${fileName} has been permanently deleted`,
      variant: "destructive"
    });
  };

  // Recursive function to render file tree with delete options
  const renderFileTree = (files: any[]) => {
    return files.map((file) => (
      <div key={file.id} className="mb-2">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3">
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4" />
            <span>{file.name}</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Permanently delete file?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete "{file.name}" 
                  {file.type === 'folder' ? ' and all its contents.' : '.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handlePermanentDelete(file.id, file.name)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {file.children && file.children.length > 0 && (
          <div className="ml-6 pl-2 border-l">
            {renderFileTree(file.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">File Storage</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete files from your storage
        </p>
        
        <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-2">
          {renderFileTree(files)}
        </div>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Clear All Files</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete all files?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all files and folders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setFiles([]);
              toast({
                title: "All Files Deleted",
                description: "All files have been permanently deleted",
                variant: "destructive"
              });
            }}>
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
