
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const models = [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
    { id: 'local-llm', name: 'Local LLM', provider: 'Local' },
    { id: 'ollama', name: 'Ollama', provider: 'Local' },
  ];

  // Group models by provider
  const groupedModels = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, typeof models>);

  // Get the name of the selected model
  const getModelName = () => {
    const model = models.find((model) => model.id === selectedModel);
    return model ? model.name : selectedModel;
  };

  return (
    <div className="p-2 border-t border-gray-800 bg-black/40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex justify-between items-center bg-gray-900 hover:bg-gray-800 border-gray-700 text-gray-300"
          >
            <span className="text-sm font-medium">{getModelName()}</span>
            <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-gray-900 border-gray-700 text-gray-300"
          align="center"
        >
          {Object.entries(groupedModels).map(([provider, models], index) => (
            <React.Fragment key={provider}>
              {index > 0 && <DropdownMenuSeparator className="bg-gray-700" />}
              <DropdownMenuLabel className="text-xs text-gray-400">
                {provider}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
                    onClick={() => onModelChange(model.id)}
                  >
                    {model.name}
                    {selectedModel === model.id && (
                      <Check className="h-4 w-4 ml-2 text-blue-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
