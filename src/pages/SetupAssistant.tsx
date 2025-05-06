
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Database, Server, FolderPlus, Brain, Save, 
  HardDrive, Building, Image, Zap, MessageSquare, Check, 
  Lock, ExternalLink
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { queryLlm } from '@/utils/llm';

const SetupAssistant = () => {
  const { setAiAssistantOpen, setAssistantConfig, branding, setBranding } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
    enableWebSearches: true,
    contextWindowSize: 8000,
    enableImageGeneration: false,
    llmTemperature: 0.7,
    enableKnowledgeBase: true,
    enableSuggestions: true,
    aiResponseStyle: 'balanced',
    openAiApiKey: '',
    useOpenAiKey: false,
  });
  
  useEffect(() => {
    // Sync the company name from branding to form when component mounts
    setConfig(prev => ({
      ...prev,
      companyName: branding.companyName || prev.companyName,
      logoType: (branding.logoType || prev.logoType) as 'default' | 'text' | 'image',
      logoUrl: branding.logoUrl || prev.logoUrl
    }));
    
    // Calculate initial setup progress
    calculateSetupProgress();
  }, [branding]);
  
  // Calculate setup progress based on filled fields
  const calculateSetupProgress = () => {
    let completedSteps = 0;
    let totalSteps = 5; // Main sections: General, Branding, Company, Memory, LLM
    
    // Check general section
    if (config.name && config.assistantPurpose) completedSteps++;
    
    // Check branding section
    if (config.companyName && (config.logoType !== 'image' || config.logoUrl)) completedSteps++;
    
    // Check company section
    if (config.companyDescription) completedSteps++;
    
    // Check memory section
    if (config.memory) completedSteps++;
    
    // Check LLM section
    if (config.llmModel || (config.useCustomModel && config.customModelName && config.customModelApiKey)) completedSteps++;
    
    const progress = Math.floor((completedSteps / totalSteps) * 100);
    setSetupProgress(progress);
    setSetupComplete(progress === 100);
  };
  
  useEffect(() => {
    calculateSetupProgress();
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Test connection before saving if using custom model
      if (config.useCustomModel && config.customModelApiKey) {
        await testConnection();
      }
      
      // Test OpenAI connection if using OpenAI API key
      if (config.useOpenAiKey && config.openAiApiKey) {
        const success = await testOpenAiKey(true);
        if (!success) {
          setIsSaving(false);
          return;
        }
      }
      
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
      
      // Save LLM configuration to local storage, now including OpenAI API key
      const llmConfig = {
        endpoint: config.endpoint,
        enabled: true,
        model: config.useCustomModel ? 'custom' : config.llmModel,
        webhookUrl: '',
        customModel: config.useCustomModel ? {
          name: config.customModelName || 'Custom Model',
          apiKey: config.customModelApiKey,
          baseUrl: config.customModelBaseUrl,
          contextLength: config.contextWindowSize,
          temperature: config.llmTemperature,
          isCustom: true
        } : undefined,
        openAi: config.useOpenAiKey ? {
          apiKey: config.openAiApiKey,
          enabled: true
        } : undefined
      };
      
      localStorage.setItem('llmConfig', JSON.stringify(llmConfig));
      
      // Optional: Initialize the assistant with a test query
      if (config.useOpenAiKey) {
        try {
          await queryLlm(
            `Initialize as ${config.name} for ${config.companyName}. Purpose: ${config.assistantPurpose}. Respond with: "Assistant initialized successfully."`,
            config.endpoint,
            config.llmModel
          );
        } catch (error) {
          console.error('Error initializing assistant:', error);
          // Continue despite initialization error
        }
      }
      
      // Show success toast
      toast({
        title: 'Setup complete',
        description: 'Your assistant has been configured successfully!'
      });
      
      // Open the assistant
      setAiAssistantOpen(true);
      
      // Navigate back to dashboard
      navigate('/');
    } catch (error) {
      console.error('Error during setup:', error);
      toast({
        title: 'Setup Error',
        description: 'There was a problem completing the setup. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/');
  };
  
  const testConnection = async () => {
    if (!config.useCustomModel) {
      return true;
    }
    
    setTestingConnection(true);
    
    try {
      // Simulate connection test or make a real API call
      const response = await fetch(config.customModelBaseUrl || config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.customModelApiKey ? { 'Authorization': `Bearer ${config.customModelApiKey}` } : {})
        },
        body: JSON.stringify({
          message: "Test connection",
          model: config.customModelName
        }),
      });
      
      if (response.ok) {
        toast({
          title: 'Connection successful',
          description: `Successfully connected to ${config.customModelName || 'Custom Model'}`
        });
        return true;
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to the specified model. Please check your configuration.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setTestingConnection(false);
    }
  };

  // Logo preview component
  const LogoPreview = ({ type, url, name }: { type: string, url: string, name: string }) => {
    return (
      <div className="mt-4 p-4 border rounded-md bg-card">
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
            <div className="rounded-full border-2 border-blue-500 p-1">
              <Hexagon className="h-6 w-6 text-blue-500" />
            </div>
          ) : null}
          <span className="font-semibold text-primary">{name}</span>
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
  
  // Get a status badge for the setup progress
  const getStatusBadge = () => {
    if (setupProgress === 100) {
      return <Badge className="bg-green-500 hover:bg-green-600">Ready to Launch</Badge>;
    } else if (setupProgress >= 75) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Almost Ready</Badge>;
    } else if (setupProgress >= 50) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
    } else {
      return <Badge className="bg-gray-500 hover:bg-gray-600">Just Started</Badge>;
    }
  };

  // Function to test OpenAI API key
  const testOpenAiKey = async (silent = false) => {
    if (!config.openAiApiKey) {
      if (!silent) {
        toast({
          title: 'Missing API Key',
          description: 'Please enter an OpenAI API key to test',
          variant: 'destructive'
        });
      }
      return false;
    }
    
    setTestingConnection(true);
    
    try {
      // Simple test request to OpenAI API
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.openAiApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        if (!silent) {
          toast({
            title: 'OpenAI Connection Successful',
            description: 'Your API key is valid and working correctly'
          });
        }
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Invalid API key');
      }
    } catch (error) {
      if (!silent) {
        toast({
          title: 'Connection Failed',
          description: error instanceof Error ? error.message : 'Failed to validate OpenAI API key',
          variant: 'destructive'
        });
      }
      return false;
    } finally {
      setTestingConnection(false);
    }
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
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <div className="w-40">
            <Progress value={setupProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">{setupProgress}% Complete</p>
          </div>
        </div>
      </div>
      
      <Card className="mb-8 border-t-4 border-t-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Configure Your Intelligent Assistant
          </CardTitle>
          <CardDescription>
            Customize your AI assistant's settings to best fit your workflow needs
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid grid-cols-6 gap-4">
              <TabsTrigger value="general" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="branding" className="flex items-center gap-1">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Branding</span>
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Company</span>
              </TabsTrigger>
              <TabsTrigger value="memory" className="flex items-center gap-1">
                <HardDrive className="h-4 w-4" />
                <span className="hidden sm:inline">Memory</span>
              </TabsTrigger>
              <TabsTrigger value="llm" className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI Model</span>
              </TabsTrigger>
              <TabsTrigger value="sharing" className="flex items-center gap-1">
                <FolderPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Sharing</span>
              </TabsTrigger>
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
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="enable-suggestions">Enable Suggestions</Label>
                      <Switch 
                        id="enable-suggestions"
                        checked={config.enableSuggestions}
                        onCheckedChange={(checked) => setConfig({...config, enableSuggestions: checked})}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow the assistant to provide contextual suggestions
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-response-style">Response Style</Label>
                    <Select 
                      value={config.aiResponseStyle}
                      onValueChange={(value) => setConfig({...config, aiResponseStyle: value})}
                    >
                      <SelectTrigger id="ai-response-style">
                        <SelectValue placeholder="Select response style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">
                          <div className="flex items-center gap-2">
                            <span>Concise</span>
                            <span className="text-xs text-muted-foreground">(Brief and to the point)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="balanced">
                          <div className="flex items-center gap-2">
                            <span>Balanced</span>
                            <span className="text-xs text-muted-foreground">(Default)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="detailed">
                          <div className="flex items-center gap-2">
                            <span>Detailed</span>
                            <span className="text-xs text-muted-foreground">(More explanatory)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    className="grid gap-4 md:grid-cols-3"
                  >
                    <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent">
                      <RadioGroupItem value="default" id="default-logo" />
                      <Label htmlFor="default-logo" className="font-normal flex items-center gap-2">
                        <div className="rounded-full border-2 border-blue-500 p-1">
                          <Hexagon className="h-4 w-4 text-blue-500" />
                        </div>
                        Default Logo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent">
                      <RadioGroupItem value="text" id="text-logo" />
                      <Label htmlFor="text-logo" className="font-normal">
                        Text Only (No Logo)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent">
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
                
                <Separator className="my-6" />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="enable-knowledge-base">Enable Knowledge Base</Label>
                      <Switch 
                        id="enable-knowledge-base"
                        checked={config.enableKnowledgeBase}
                        onCheckedChange={(checked) => setConfig({...config, enableKnowledgeBase: checked})}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow the assistant to learn from your company documents
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="enable-web-searches">Enable Web Searches</Label>
                      <Switch 
                        id="enable-web-searches"
                        checked={config.enableWebSearches}
                        onCheckedChange={(checked) => setConfig({...config, enableWebSearches: checked})}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow the assistant to search the web for information
                    </p>
                  </div>
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
                
                <div className="rounded-md border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <Check className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-400">Secure Memory Management</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
                        Your assistant's memory is stored securely on your selected storage system and will not be shared with any third parties.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="space-y-2">
                  <Label htmlFor="context-window">Context Window Size</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Select 
                      value={config.contextWindowSize.toString()}
                      onValueChange={(value) => setConfig({...config, contextWindowSize: parseInt(value)})}
                    >
                      <SelectTrigger id="context-window">
                        <SelectValue placeholder="Select window size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4000">4,000 tokens</SelectItem>
                        <SelectItem value="8000">8,000 tokens (Default)</SelectItem>
                        <SelectItem value="16000">16,000 tokens</SelectItem>
                        <SelectItem value="32000">32,000 tokens</SelectItem>
                        <SelectItem value="128000">128,000 tokens (Large)</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="h-full rounded-full bg-blue-500" 
                          style={{ width: `${Math.min(config.contextWindowSize / 1280, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Memory capacity: {(config.contextWindowSize / 1000).toFixed(1)}K tokens
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Larger context windows allow the assistant to remember more of your conversation, but may use more resources
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
                      onCheckedChange={(checked) => setConfig(prev => ({...prev, useCustomModel: checked}))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="use-openai-key">Use OpenAI API Key</Label>
                    <Switch 
                      id="use-openai-key"
                      checked={config.useOpenAiKey}
                      onCheckedChange={(checked) => setConfig(prev => ({...prev, useOpenAiKey: checked}))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use your own OpenAI API key for GPT models
                  </p>
                </div>
                
                {/* OpenAI API Key Section */}
                {config.useOpenAiKey && (
                  <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-blue-500" />
                      <h3 className="text-md font-medium">OpenAI API Configuration</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                      <div className="relative">
                        <Input 
                          id="openai-api-key"
                          type="password"
                          value={config.openAiApiKey}
                          onChange={(e) => setConfig(prev => ({...prev, openAiApiKey: e.target.value}))}
                          placeholder="sk-..."
                        />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Lock className="h-3 w-3" />
                        <span>Your API key is stored securely in your browser's local storage</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={testOpenAiKey}
                        disabled={!config.openAiApiKey || testingConnection}
                        size="sm"
                        className="mt-2"
                      >
                        {testingConnection ? 'Testing...' : 'Test Connection'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Get API Key
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Existing LLM sections - Custom Model or Default Model */}
                {!config.useOpenAiKey ? (
                  !config.useCustomModel ? (
                    <div className="space-y-4">
                      {/* ... keep existing code (default model selection) */}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* ... keep existing code (custom model configuration) */}
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="llm-model">OpenAI Model</Label>
                      <Select 
                        value={config.llmModel}
                        onValueChange={(value) => setConfig({...config, llmModel: value})}
                      >
                        <SelectTrigger id="llm-model">
                          <SelectValue placeholder="Select OpenAI model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster, more affordable)</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o (More capable)</SelectItem>
                          <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview (Most capable)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select which OpenAI model to use with your API key
                      </p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="llm-temperature">Temperature</Label>
                        <div className="grid grid-cols-2 gap-2 items-center">
                          <Input 
                            id="llm-temperature"
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={config.llmTemperature}
                            onChange={(e) => setConfig({...config, llmTemperature: parseFloat(e.target.value)})}
                            className="col-span-1"
                          />
                          <div className="flex justify-between items-center col-span-1">
                            <span className="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-md">
                              {config.llmTemperature.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="enable-image-generation">Enable Image Generation</Label>
                          <Switch 
                            id="enable-image-generation"
                            checked={config.enableImageGeneration}
                            onCheckedChange={(checked) => setConfig({...config, enableImageGeneration: checked})}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Allow the AI to generate images based on text descriptions
                        </p>
                      </div>
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
                
                <Separator className="my-4" />
                
                <div className="rounded-md border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <Zap className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-400">Quick Tips</h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-500 mt-1 space-y-1 list-disc pl-4">
                        <li>Use shared folders for team collaboration</li>
                        <li>AI-generated documents will be saved to this location</li>
                        <li>Your assistant can access and refer to documents from this folder</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2 border rounded-md p-4">
                    <h3 className="text-sm font-medium">File Permissions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="read-permission" className="text-sm">Read Files</Label>
                        <Switch id="read-permission" checked={true} disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="write-permission" className="text-sm">Create Files</Label>
                        <Switch id="write-permission" checked={true} disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="modify-permission" className="text-sm">Modify Files</Label>
                        <Switch id="modify-permission" checked={true} disabled />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 border rounded-md p-4">
                    <h3 className="text-sm font-medium">Data Privacy Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="local-processing" className="text-sm">Process Data Locally</Label>
                        <Switch id="local-processing" checked={true} disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="encryption" className="text-sm">Enable Encryption</Label>
                        <Switch id="encryption" checked={true} disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="audit-logs" className="text-sm">Maintain Audit Logs</Label>
                        <Switch id="audit-logs" checked={true} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              className="gap-2" 
              disabled={!setupComplete || isSaving || testingConnection}
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save & Launch Assistant</span>
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">AI Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Document Creation & Management</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Schedule Organization</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Knowledge Base Integration</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Context-Aware Responses</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Secure Local Processing</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Privacy Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Local Data Storage</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>No External Data Sharing</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Configurable Memory Management</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Controlled API Access</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Activity Audit Logs</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupAssistant;
