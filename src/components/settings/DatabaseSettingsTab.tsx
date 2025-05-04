
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
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
import { Database, Trash2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface DatabaseConnection {
  type: 'supabase' | 'postgres' | 'pgvector';
  url: string;
  name: string;
  connected: boolean;
}

export const DatabaseSettingsTab = () => {
  const { databaseTables, setCurrentTable } = useAppContext();
  const [connections, setConnections] = useState<DatabaseConnection[]>([
    { type: 'supabase', url: '', name: 'Supabase', connected: false },
    { type: 'postgres', url: '', name: 'PostgreSQL', connected: false },
    { type: 'pgvector', url: '', name: 'pgvector', connected: false }
  ]);

  const handleConnect = (index: number) => {
    const updatedConnections = [...connections];
    updatedConnections[index].connected = !updatedConnections[index].connected;
    setConnections(updatedConnections);
    
    if (updatedConnections[index].connected) {
      toast({
        title: "Connected",
        description: `Connected to ${updatedConnections[index].name}`
      });
    } else {
      toast({
        title: "Disconnected",
        description: `Disconnected from ${updatedConnections[index].name}`
      });
    }
  };
  
  const handlePermanentDelete = (tableId: string) => {
    // In a real app, this would delete the table from the database
    toast({
      title: "Table Deleted",
      description: "The table has been permanently deleted",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Database Connections</h3>
        
        {connections.map((connection, index) => (
          <div key={connection.type} className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5 flex items-center">
              <Database className="mr-2 h-4 w-4" />
              <div>
                <h4 className="text-base font-medium">{connection.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {connection.connected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {connection.connected ? (
                <Button 
                  variant="outline" 
                  onClick={() => handleConnect(index)}
                  size="sm"
                >
                  Disconnect
                </Button>
              ) : (
                <Button 
                  onClick={() => handleConnect(index)}
                  size="sm"
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Manage Database Tables</h3>
        <p className="text-sm text-muted-foreground">
          Warning: Deleting tables will permanently remove all data.
        </p>
        
        {databaseTables.map((table) => (
          <div key={table.id} className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <h4 className="text-base font-medium">{table.name}</h4>
              <p className="text-sm text-muted-foreground">
                {table.rows.length} rows, {table.columns.length} columns
              </p>
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
                  <AlertDialogTitle>Permanently delete table?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the 
                    "{table.name}" table and all its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handlePermanentDelete(table.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
};
