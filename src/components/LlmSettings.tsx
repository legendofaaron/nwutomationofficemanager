
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface LlmConfig {
  endpoint: string;
  enabled: boolean;
  model: string;
}

export const LlmSettings = () => {
  const [config, setConfig] = useState<LlmConfig>({
    endpoint: 'http://localhost:5678/workflow/EQL62DuHvzL2PmBk',
    enabled: false,
    model: 'default'
  });

  const testConnection = async () => {
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Test connection",
          model: config.model
        }),
      });
      
      if (response.ok) {
        toast({
          title: 'Connection Successful',
          description: 'Successfully connected to n8n RAG agent'
        });
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to n8n. Please check your endpoint and ensure n8n is running.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">n8n RAG Agent Settings</h3>
          <p className="text-sm text-gray-500">Configure your n8n RAG agent connection</p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="endpoint">n8n Workflow Endpoint</Label>
          <Input
            id="endpoint"
            value={config.endpoint}
            onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
            placeholder="http://localhost:5678/workflow/[ID]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">LLM Model</Label>
          <Select
            value={config.model}
            onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}
          >
            <SelectTrigger id="model" className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview</SelectItem>
              <SelectItem value="llama-3.1-8b">Llama 3.1 (8B)</SelectItem>
              <SelectItem value="llama-3.1-70b">Llama 3.1 (70B)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Select the language model you want to use with your n8n workflow
          </p>
        </div>

        <Button onClick={testConnection}>
          Test Connection
        </Button>
      </div>
    </div>
  );
};
