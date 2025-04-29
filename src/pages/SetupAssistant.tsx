
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Server, FolderPlus, Brain, Save, HardDrive } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';

const SetupAssistant = () => {
  const { setAiAssistantOpen } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  
  // Form state
  const [config, setConfig] = useState({
    name: 'My Assistant',
    memory: 'postgres',
    llmModel: 'gpt-4o-mini',
    enableSharedFolder: true,
    folderPath: '/shared',
    endpoint: 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk',
  });
  
  const handleSave = () => {
    // Here you would save the configuration to your state management or backend
    
    // For now, we'll just show a success toast and redirect
    toast({
      title: 'Setup complete',
      description: 'Your assistant has been configured successfully!'
    });
    
    // Open the assistant
    setAiAssistantOpen(true);
    
    // Navigate back to dashboard
    navigate('/dashboard');
  };
  
  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCancel} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo />
          <h1 className="text-2xl font-bold">Assistant Setup</h1>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-app-blue" />
            Configure Your Intelligent Assistant
          </CardTitle>
          <CardDescription>
            Customize your AI assistant's settings to best fit your workflow needs
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="memory">Memory Storage</TabsTrigger>
              <TabsTrigger value="llm">Language Model</TabsTrigger>
              <TabsTrigger value="sharing">Sharing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="assistant-name">Assistant Name</Label>
                  <Input 
                    id="assistant-name" 
                    value={config.name} 
                    onChange={(e) => setConfig({...config, name: e.target.value})}
                    placeholder="My Office Assistant" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="memory">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="memory-type">Memory Storage Type</Label>
                  <Select 
                    value={config.memory}
                    onValueChange={(value) => setConfig({...config, memory: value})}
                  >
                    <SelectTrigger id="memory-type">
                      <SelectValue placeholder="Select memory storage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgres">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          <span>PostgreSQL (Recommended)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="redis">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4" />
                          <span>Redis</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="filesystem">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4" />
                          <span>File System</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select where your assistant will store conversation history and context
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="llm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="llm-model">Language Model</Label>
                  <Select 
                    value={config.llmModel}
                    onValueChange={(value) => setConfig({...config, llmModel: value})}
                  >
                    <SelectTrigger id="llm-model">
                      <SelectValue placeholder="Select language model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster, more affordable)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o (More capable)</SelectItem>
                      <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview (Most capable)</SelectItem>
                      <SelectItem value="llama-3.1-8b">Llama 3.1 (8B)</SelectItem>
                      <SelectItem value="llama-3.1-70b">Llama 3.1 (70B)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input 
                    id="endpoint"
                    value={config.endpoint}
                    onChange={(e) => setConfig({...config, endpoint: e.target.value})}
                    placeholder="http://localhost:5678/workflow/[ID]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Custom endpoint for your language model service
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sharing">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shared-folder">Enable Shared Folder</Label>
                    <p className="text-sm text-muted-foreground">
                      Create a shared folder for documents generated by the assistant
                    </p>
                  </div>
                  <Switch 
                    id="shared-folder"
                    checked={config.enableSharedFolder}
                    onCheckedChange={(checked) => setConfig({...config, enableSharedFolder: checked})}
                  />
                </div>
                
                {config.enableSharedFolder && (
                  <div className="space-y-2">
                    <Label htmlFor="folder-path">Folder Path</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="folder-path"
                        value={config.folderPath}
                        onChange={(e) => setConfig({...config, folderPath: e.target.value})}
                        placeholder="/shared"
                      />
                      <Button variant="outline" className="flex items-center gap-2">
                        <FolderPlus className="h-4 w-4" />
                        Browse
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save & Launch Assistant
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupAssistant;
