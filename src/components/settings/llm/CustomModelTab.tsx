
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomModelTabProps {
  name: string;
  setName: (name: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  contextLength: number;
  setContextLength: (length: number) => void;
}

export const CustomModelTab: React.FC<CustomModelTabProps> = ({
  name,
  setName,
  apiKey,
  setApiKey,
  baseUrl,
  setBaseUrl,
  contextLength,
  setContextLength
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Custom Language Model</h3>
        <p className="text-sm text-gray-500 mb-4">Configure your own language model settings</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="custom-name">Model Name</Label>
          <Input
            id="custom-name"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Custom Model"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custom-api-key">API Key</Label>
          <Input
            id="custom-api-key"
            type="password"
            value={apiKey || ''}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Your API key will be stored locally in your browser
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custom-base-url">Base URL (Optional)</Label>
          <Input
            id="custom-base-url"
            value={baseUrl || ''}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.example.com/v1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to use the default endpoint
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custom-context-length">Context Length</Label>
          <Input
            id="custom-context-length"
            type="number"
            value={contextLength || 4000}
            onChange={(e) => setContextLength(parseInt(e.target.value) || 4000)}
            min={1000}
            max={100000}
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of tokens this model can process
          </p>
        </div>
      </div>
    </div>
  );
};
