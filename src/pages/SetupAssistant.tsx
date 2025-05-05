import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Server, FolderPlus, Brain, Save, HardDrive, Building, FileText, Image } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Hexagon } from 'lucide-react';

const SetupAssistant = () => {
  const { setAiAssistantOpen, setAssistantConfig, branding, setBranding } = useAppContext();
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
    companyName: branding.companyName || '',
    companyDescription: '',
    assistantPurpose: 'General office tasks and document management',
    logoType: branding.logoType || 'default' as 'default' | 'text' | 'image',
    logoUrl: branding.logoUrl || '',
    useCustomModel: false,
    customModelName: '',
    customModelApiKey: '',
    customModelBaseUrl: '',
  });
  
  useEffect(() => {
    // Sync the company name from branding to form when component mounts
    setConfig(prev => ({
      ...prev,
      companyName: branding.companyName || prev.companyName,
      logoType: (branding.logoType || prev.logoType) as 'default' | 'text' | 'image',
      logoUrl: branding.logoUrl || prev.logoUrl
    }));
  }, [branding]);

  const handleSave = () => {
    // Update global assistant configuration
    setAssistantConfig({
      name: config.name,
      companyName: config.companyName,
      companyDescription: config.companyDescription,
      purpose: config.assistantPurpose
    });
    
    // Update branding configuration with proper type checking
    setBranding({
      companyName: config.companyName,
      logoType: config.logoType as 'default' | 'text' | 'image',
      logoUrl: config.logoUrl
    });
    
    // Show success toast
    toast({
      title: 'Setup complete',
      description: 'Your assistant and branding have been configured successfully!'
    });
    
    // Open the assistant
    setAiAssistantOpen(true);
    
    // Navigate back to dashboard
    navigate('/');
  };
  
  const handleCancel = () => {
    navigate('/');
  };

  // Logo preview component
  const LogoPreview = ({ type, url, name }: { type: string, url: string, name: string }) => {
    return (
      <div className="mt-4 p-4 border rounded-md">
        <h4 className="text-sm font-medium mb-2">Logo Preview:</h4>
        <div className="flex items-center gap-2">
          {type === 'image' && url ? (
            <img 
              src={url} 
              alt={`${name} logo`} 
              className="h-6 w-auto"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : type === 'default' ? (
            <div className="rounded-full border-2 border-app-blue p-1">
              <Hexagon className="h-6 w-6 text-app-blue" />
            </div>
          ) : null}
          <span className="font-semibold text-app-blue">{name}</span>
        </div>
      </div>
    );
  };

  // Ensure we handle logoType properly in RadioGroup value changes
  const handleLogoTypeChange = (value: string) => {
    setConfig({
      ...config, 
      logoType: value as 'default' | 'text' | 'image'
    });
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
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="company">Company Details</TabsTrigger>
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
                
                <div className="space-y-2">
                  <Label htmlFor="assistant-purpose">Assistant Purpose</Label>
                  <Textarea 
                    id="assistant-purpose" 
                    value={config.assistantPurpose} 
                    onChange={(e) => setConfig({...config, assistantPurpose: e.target.value})}
                    placeholder="Describe what you'd like your assistant to help you with..." 
                    className="min-h-[80px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Describe the main tasks and responsibilities you want your assistant to handle
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="branding">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name" 
                    value={config.companyName} 
                    onChange={(e) => setConfig({...config, companyName: e.target.value})}
                    placeholder="Acme Inc." 
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This name will appear throughout the application and in the logo
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Label>Logo Type</Label>
                  <RadioGroup
                    value={config.logoType}
                    onValueChange={handleLogoTypeChange}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="default" id="default-logo" />
                      <Label htmlFor="default-logo" className="font-normal flex items-center gap-2">
                        <div className="rounded-full border-2 border-app-blue p-1">
                          <Hexagon className="h-4 w-4 text-app-blue" />
                        </div>
                        Default Logo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="text" id="text-logo" />
                      <Label htmlFor="text-logo" className="font-normal">
                        Text Only (No Logo)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="image" id="image-logo" />
                      <Label htmlFor="image-logo" className="font-normal">
                        Custom Image
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {config.logoType === 'image' && (
                  <div className="space-y-2">
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="logo-url" 
                        value={config.logoUrl || ''} 
                        onChange={(e) => setConfig({...config, logoUrl: e.target.value})}
                        placeholder="https://example.com/logo.png" 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter the URL of your company logo. Recommended size: 64x64px.
                    </p>
                  </div>
                )}

                <LogoPreview 
                  type={config.logoType} 
                  url={config.logoUrl || ''} 
                  name={config.companyName} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="company">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-description">Company Description</Label>
                  <Textarea 
                    id="company-description" 
                    value={config.companyDescription} 
                    onChange={(e) => setConfig({...config, companyDescription: e.target.value})}
                    placeholder="Tell us about your company..." 
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Provide information about your company to help the assistant better understand your context
                  </p>
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="use-custom-model">Use Custom Model</Label>
                    <Switch 
                      id="use-custom-model"
                      checked={config.useCustomModel}
                      onCheckedChange={(checked) => setConfig({...config, useCustomModel: checked})}
                    />
                  </div>
                </div>
                
                {!config.useCustomModel ? (
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
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-model-name">Custom Model Name</Label>
                      <Input 
                        id="custom-model-name"
                        value={config.customModelName}
                        onChange={(e) => setConfig({...config, customModelName: e.target.value})}
                        placeholder="My Custom Model"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-model-api-key">API Key</Label>
                      <Input 
                        id="custom-model-api-key"
                        type="password"
                        value={config.customModelApiKey}
                        onChange={(e) => setConfig({...config, customModelApiKey: e.target.value})}
                        placeholder="sk-..."
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Your API key will be stored locally in your browser
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-model-base-url">Base URL (Optional)</Label>
                      <Input 
                        id="custom-model-base-url"
                        value={config.customModelBaseUrl}
                        onChange={(e) => setConfig({...config, customModelBaseUrl: e.target.value})}
                        placeholder="https://api.example.com/v1"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Leave empty to use the default endpoint
                      </p>
                    </div>
                  </div>
                )}
                
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
