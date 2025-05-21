
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Cpu, Download, CheckCircle } from 'lucide-react';
import { ModelUploader } from '@/components/ModelUploader';
import { UploadedModel } from '@/types/llmConfig';

interface LocalModelsTabProps {
  useLocalLlama: boolean;
  handleLocalLlamaToggle: (enabled: boolean) => void;
  threads: number;
  setThreads: (threads: number) => void;
  contextSize: number;
  setContextSize: (size: number) => void;
  modelPath: string;
  setModelPath: (path: string) => void;
  uploadedModels: UploadedModel[];
  handleModelUploaded: (modelPath: string, modelName: string) => void;
  selectUploadedModel: (modelPath: string) => void;
  downloadLocalModel: (modelName: string) => void;
  isDownloading: boolean;
  downloadModelName: string;
  downloadProgress: number;
  testLocalModel: () => void;
  checkAccess: (feature: string) => boolean;
}

export const LocalModelsTab: React.FC<LocalModelsTabProps> = ({
  useLocalLlama,
  handleLocalLlamaToggle,
  threads,
  setThreads,
  contextSize,
  setContextSize,
  modelPath,
  setModelPath,
  uploadedModels,
  handleModelUploaded,
  selectUploadedModel,
  downloadLocalModel,
  isDownloading,
  downloadModelName,
  downloadProgress,
  testLocalModel,
  checkAccess,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Local AI Models</h3>
        <p className="text-sm text-gray-500 mb-4">Run language models directly on your device for privacy and offline use</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Enable Local Models</h4>
          <p className="text-sm text-gray-500">Process all queries on your device</p>
        </div>
        <Switch
          checked={useLocalLlama}
          onCheckedChange={(checked) => handleLocalLlamaToggle(checked)}
        />
      </div>
      
      {useLocalLlama && (
        <div className="space-y-6 border rounded-md p-4 bg-muted/20">
          <div className="space-y-2">
            <Label htmlFor="cpu-threads">CPU Threads</Label>
            <div className="flex items-center space-x-2">
              <Slider
                id="cpu-threads"
                defaultValue={[threads]}
                value={[threads]}
                max={16}
                min={1}
                step={1}
                onValueChange={(value) => setThreads(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-center">{threads}</span>
            </div>
            <p className="text-xs text-gray-500">Higher values may improve performance on multi-core systems</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="context-size">Context Size (tokens)</Label>
            <div className="flex items-center space-x-2">
              <Slider
                id="context-size"
                defaultValue={[contextSize]}
                value={[contextSize]}
                max={8192}
                min={512}
                step={512}
                onValueChange={(value) => setContextSize(value[0])}
                className="flex-1"
              />
              <span className="w-16 text-center">{contextSize}</span>
            </div>
            <p className="text-xs text-gray-500">Larger context allows for longer conversations (uses more memory)</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Your Models</Label>
              <p className="text-xs text-gray-500 mb-2">Upload a model or select an existing one</p>
            </div>
            
            <div className="mt-2 border border-dashed rounded-md p-4 bg-muted/10">
              <ModelUploader onModelUploaded={(path, name) => handleModelUploaded(path, name)} />
            </div>
            
            <div className="mt-4">
              <Label>Available Models</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <Card 
                  className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => downloadLocalModel('llama-3-8b-q4')}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Llama 3 (8B, Q4)</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2"
                        disabled={isDownloading}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        <span className="text-xs">Download</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Balanced model, good for general use (~4.3GB)
                    </p>
                    {isDownloading && downloadModelName === 'llama-3-8b-q4' && (
                      <div className="pt-1">
                        <Progress value={downloadProgress} className="h-1" />
                        <p className="text-xs text-center pt-1">
                          {downloadProgress < 100 ? 'Downloading...' : 'Installing...'}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
                
                <Card 
                  className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => downloadLocalModel('llama-3-1b-q4')}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Llama 3 (1B, Q4)</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2"
                        disabled={isDownloading}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        <span className="text-xs">Download</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lightweight model, fast on low-end devices (~600MB)
                    </p>
                    {isDownloading && downloadModelName === 'llama-3-1b-q4' && (
                      <div className="pt-1">
                        <Progress value={downloadProgress} className="h-1" />
                        <p className="text-xs text-center pt-1">
                          {downloadProgress < 100 ? 'Downloading...' : 'Installing...'}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
            
            {uploadedModels.length > 0 && (
              <div className="mt-4">
                <Label>Your Uploaded Models</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {uploadedModels.map((model, index) => (
                    <Card 
                      key={index}
                      className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                        modelPath === model.path ? 'border-primary' : ''
                      }`}
                      onClick={() => selectUploadedModel(model.path)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">{model.name}</h4>
                          <p className="text-xs text-muted-foreground">{model.path}</p>
                        </div>
                        {modelPath === model.path && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="model-path">Custom Model Path</Label>
              <Input
                id="model-path"
                placeholder="/path/to/your/model.gguf"
                value={modelPath || ''}
                onChange={(e) => setModelPath(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the file path to a custom GGUF model
              </p>
            </div>
            
            <Button className="w-full" onClick={testLocalModel}>
              Test Model Connection
            </Button>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Cpu className="h-3 w-3" />
              <span>Processing happens locally for privacy</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
