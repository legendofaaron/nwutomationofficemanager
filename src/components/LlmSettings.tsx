
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface LlmConfig {
  endpoint: string;
  model: string;
  enabled: boolean;
}

export const LlmSettings = () => {
  const [config, setConfig] = useState<LlmConfig>({
    endpoint: 'http://localhost:11434',
    model: 'llama2',
    enabled: false
  });

  const testConnection = async () => {
    try {
      const response = await fetch(`${config.endpoint}/api/tags`);
      if (response.ok) {
        toast({
          title: 'Connection Successful',
          description: 'Successfully connected to Ollama'
        });
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to Ollama. Please check your endpoint and ensure Ollama is running.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Local LLM Settings</h3>
          <p className="text-sm text-gray-500">Configure your local LLM connection</p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="endpoint">Ollama Endpoint</Label>
          <Input
            id="endpoint"
            value={config.endpoint}
            onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
            placeholder="http://localhost:11434"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model Name</Label>
          <Input
            id="model"
            value={config.model}
            onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
            placeholder="llama2"
          />
        </div>

        <Button onClick={testConnection}>
          Test Connection
        </Button>
      </div>
    </div>
  );
};
