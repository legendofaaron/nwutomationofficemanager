
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { Database, Trash2, RefreshCw, Server, Key, Shield } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface DatabaseConnection {
  type: 'supabase' | 'postgres' | 'pgvector';
  url: string;
  name: string;
  connected: boolean;
}

interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  serviceKey: string;
  enableRLS: boolean;
  localSupabase: boolean;
  localPort: string;
}

export const DatabaseSettingsTab = () => {
  const { databaseTables, setCurrentTable } = useAppContext();
  const [connections, setConnections] = useState<DatabaseConnection[]>([
    { type: 'supabase', url: '', name: 'Supabase', connected: false },
    { type: 'postgres', url: '', name: 'PostgreSQL', connected: false },
    { type: 'pgvector', url: '', name: 'pgvector', connected: false }
  ]);
  
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    projectUrl: 'https://your-project.supabase.co',
    anonKey: '',
    serviceKey: '',
    enableRLS: true,
    localSupabase: false,
    localPort: '54321',
  });

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

  const handleSupabaseConfigChange = (field: keyof SupabaseConfig, value: string | boolean) => {
    setSupabaseConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSupabaseConfig = () => {
    toast({
      title: "Supabase Configuration Saved",
      description: supabaseConfig.localSupabase 
        ? "Local Supabase configuration has been saved" 
        : "Supabase cloud configuration has been saved"
    });
  };

  const testConnection = () => {
    toast({
      title: "Testing Connection",
      description: "Attempting to connect to Supabase..."
    });
    
    // Simulate a successful connection after a short delay
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: supabaseConfig.localSupabase
          ? `Connected to local Supabase at port ${supabaseConfig.localPort}`
          : "Connected to Supabase cloud project"
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connections" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="supabase" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-6 w-6" viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/>
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fillOpacity="0.2"/>
                  <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04076L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#249361"/>
                      <stop offset="1" stopColor="#3ECF8E"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4849" y2="106.506" gradientUnits="userSpaceOnUse">
                      <stop/>
                      <stop offset="1" stopColor="white"/>
                    </linearGradient>
                  </defs>
                </svg>
                Supabase Configuration
              </CardTitle>
              <CardDescription>
                Connect to your Supabase project to enable database features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch 
                  id="local-supabase" 
                  checked={supabaseConfig.localSupabase}
                  onCheckedChange={(checked) => handleSupabaseConfigChange('localSupabase', checked)}
                />
                <Label htmlFor="local-supabase" className="font-medium">Use Local Supabase</Label>
                {supabaseConfig.localSupabase && (
                  <Badge className="text-xs bg-green-600">Development</Badge>
                )}
              </div>

              {supabaseConfig.localSupabase ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="local-port">Local Port</Label>
                      <div className="flex mt-2">
                        <Input 
                          id="local-port" 
                          value={supabaseConfig.localPort} 
                          onChange={(e) => handleSupabaseConfigChange('localPort', e.target.value)}
                          placeholder="54321"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Default port for Supabase local development is 54321
                      </p>
                    </div>
                    <div className="flex-1">
                      <Label>Local URL</Label>
                      <div className="flex items-center h-10 px-4 mt-2 rounded-md border bg-muted text-muted-foreground">
                        http://localhost:{supabaseConfig.localPort}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="anon-key">Anonymous Key</Label>
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Generate
                      </Button>
                    </div>
                    <Input 
                      id="anon-key" 
                      value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
                      readOnly
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Public API key for anonymous access
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="service-key">Service Key</Label>
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Generate
                      </Button>
                    </div>
                    <Input 
                      id="service-key" 
                      value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
                      readOnly
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Secret API key for server-side operations
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-url">Project URL</Label>
                    <Input 
                      id="project-url" 
                      value={supabaseConfig.projectUrl} 
                      onChange={(e) => handleSupabaseConfigChange('projectUrl', e.target.value)}
                      placeholder="https://your-project.supabase.co"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="anon-key">Anonymous Key</Label>
                    <Input 
                      id="anon-key" 
                      value={supabaseConfig.anonKey} 
                      onChange={(e) => handleSupabaseConfigChange('anonKey', e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Public API key found in your Supabase dashboard
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-key">Service Role Key (Optional)</Label>
                    <Input 
                      id="service-key" 
                      value={supabaseConfig.serviceKey} 
                      onChange={(e) => handleSupabaseConfigChange('serviceKey', e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      type="password"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Secret API key used for server-side operations
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="enable-rls" 
                  checked={supabaseConfig.enableRLS}
                  onCheckedChange={(checked) => handleSupabaseConfigChange('enableRLS', checked)}
                />
                <Label htmlFor="enable-rls" className="font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Enable Row Level Security (RLS)
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={testConnection}>
                <Server className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
              <Button onClick={saveSupabaseConfig}>
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="tables" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Manage Database Tables</h3>
              <Button size="sm" className="gap-1">
                <svg className="h-4 w-4" viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/>
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fillOpacity="0.2"/>
                  <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04076L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#249361"/>
                      <stop offset="1" stopColor="#3ECF8E"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4849" y2="106.506" gradientUnits="userSpaceOnUse">
                      <stop/>
                      <stop offset="1" stopColor="white"/>
                    </linearGradient>
                  </defs>
                </svg>
                Create Table
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Warning: Deleting tables will permanently remove all data.
            </p>
            
            <ScrollArea className="h-[300px] rounded-md border">
              {databaseTables.map((table) => (
                <div key={table.id} className="flex flex-row items-center justify-between p-4 hover:bg-accent/50 border-b last:border-b-0">
                  <div className="space-y-0.5">
                    <h4 className="text-base font-medium flex items-center">
                      <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                      {table.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {table.rows.length} rows, {table.columns.length} columns
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCurrentTable(table)}
                    >
                      View
                    </Button>
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
                </div>
              ))}
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
