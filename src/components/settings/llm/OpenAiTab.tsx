
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Lock } from 'lucide-react';

interface OpenAiTabProps {
  useOpenAiKey: boolean;
  handleOpenAiToggle: (enabled: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
  testOpenAiKey: () => void;
  testingOpenAi: boolean;
  checkAccess: (feature: string) => boolean;
}

export const OpenAiTab: React.FC<OpenAiTabProps> = ({
  useOpenAiKey,
  handleOpenAiToggle,
  apiKey,
  setApiKey,
  model,
  setModel,
  testOpenAiKey,
  testingOpenAi,
  checkAccess
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">OpenAI Configuration</h3>
        <p className="text-sm text-gray-500 mb-4">Configure your OpenAI API key as a fallback option</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Enable OpenAI Integration</h4>
          <p className="text-sm text-gray-500">Use your own OpenAI API key</p>
        </div>
        <Switch
          checked={useOpenAiKey}
          onCheckedChange={(checked) => handleOpenAiToggle(checked)}
        />
      </div>
      
      {useOpenAiKey && (
        <div className="space-y-4 border rounded-md p-4 bg-muted/20">
          <div className="space-y-2">
            <Label htmlFor="openai-api-key">OpenAI API Key</Label>
            <div className="relative">
              <Input 
                id="openai-api-key"
                type="password"
                value={apiKey || ''}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Lock className="h-3 w-3" />
              <span>Your API key is stored securely in your browser's local storage</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="openai-model">OpenAI Model</Label>
            <Select 
              value={model}
              onValueChange={setModel}
            >
              <SelectTrigger id="openai-model">
                <SelectValue placeholder="Select OpenAI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster, more affordable)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o (More capable)</SelectItem>
                <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview (Most capable)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              onClick={testOpenAiKey}
              disabled={!apiKey || testingOpenAi}
              size="sm"
              className="mt-2"
            >
              {testingOpenAi ? 'Testing...' : 'Test Connection'}
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
    </div>
  );
};
