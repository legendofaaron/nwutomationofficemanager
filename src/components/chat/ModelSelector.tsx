
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

// Model types with icons
const models = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', icon: '🔵', description: 'Fast and economical for most tasks' },
  { id: 'gpt-4o', name: 'GPT-4o', icon: '🟣', description: 'Advanced capabilities with vision' },
  { id: 'o1', name: 'o1', icon: '🟡', description: 'Anthropic\'s powerful model' },
  { id: 'o1-mini', name: 'o1 Mini', icon: '🟢', description: 'Balanced speed and capability' },
  { id: 'o3-mini', name: 'o3 Mini', icon: '🟠', description: 'Latest compact model' },
  { id: 'claude-3.5-haiku', name: 'Claude 3.5 Haiku', icon: '🔶', description: 'Quick responses for simple tasks' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', icon: '⚪', description: 'Balanced performance' },
  { id: 'claude-3.5-opus', name: 'Claude 3.5 Opus', icon: '🔴', description: 'Most powerful for complex tasks' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', icon: '🔷', description: 'Google\'s advanced model' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', icon: '🔵', description: 'Fast responses from Google' },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', icon: '🔄', description: 'Open source large model' },
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', icon: '🔄', description: 'Massive open model capabilities' },
  { id: 'local-llm', name: 'Local LLM', icon: '💻', description: 'Run models locally on your computer' },
  { id: 'ollama', name: 'Ollama', icon: '🐑', description: 'Local model runner' },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const handleValueChange = (value: string) => {
    onModelChange(value);
  };

  // Find the selected model details
  const currentModel = models.find(model => model.id === selectedModel) || models[0];

  return (
    <div className="p-2 border-t border-gray-800 bg-black">
      <Select value={selectedModel} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
          <SelectValue placeholder="Select a model">
            <div className="flex items-center">
              <span className="mr-2">{currentModel.icon}</span>
              <span>{currentModel.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          <SelectGroup>
            <SelectLabel>OpenAI</SelectLabel>
            <SelectItem value="gpt-4o-mini" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">🔵</span>
                <div className="flex flex-col">
                  <span>GPT-4o Mini</span>
                  <span className="text-xs text-gray-400">Fast and economical for most tasks</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="gpt-4o" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white">🟣</span>
                <div className="flex flex-col">
                  <span>GPT-4o</span>
                  <span className="text-xs text-gray-400">Advanced capabilities with vision</span>
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
          
          <SelectGroup>
            <SelectLabel>Anthropic</SelectLabel>
            <SelectItem value="o1" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white">🟡</span>
                <div className="flex flex-col">
                  <span>o1</span>
                  <span className="text-xs text-gray-400">Anthropic's powerful model</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="o1-mini" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">🟢</span>
                <div className="flex flex-col">
                  <span>o1 Mini</span>
                  <span className="text-xs text-gray-400">Balanced speed and capability</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="o3-mini" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">🟠</span>
                <div className="flex flex-col">
                  <span>o3 Mini</span>
                  <span className="text-xs text-gray-400">Latest compact model</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="claude-3.5-haiku" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white">🔶</span>
                <div className="flex flex-col">
                  <span>Claude 3.5 Haiku</span>
                  <span className="text-xs text-gray-400">Quick responses for simple tasks</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="claude-3.5-sonnet" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-black">⚪</span>
                <div className="flex flex-col">
                  <span>Claude 3.5 Sonnet</span>
                  <span className="text-xs text-gray-400">Balanced performance</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="claude-3.5-opus" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white">🔴</span>
                <div className="flex flex-col">
                  <span>Claude 3.5 Opus</span>
                  <span className="text-xs text-gray-400">Most powerful for complex tasks</span>
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
          
          <SelectGroup>
            <SelectLabel>Google</SelectLabel>
            <SelectItem value="gemini-1.5-pro" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white">🔷</span>
                <div className="flex flex-col">
                  <span>Gemini 1.5 Pro</span>
                  <span className="text-xs text-gray-400">Google's advanced model</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="gemini-2.0-flash" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">🔵</span>
                <div className="flex flex-col">
                  <span>Gemini 2.0 Flash</span>
                  <span className="text-xs text-gray-400">Fast responses from Google</span>
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
          
          <SelectGroup>
            <SelectLabel>Open Source</SelectLabel>
            <SelectItem value="llama-3.3-70b" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">🔄</span>
                <div className="flex flex-col">
                  <span>Llama 3.3 70B</span>
                  <span className="text-xs text-gray-400">Open source large model</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="llama-3.1-405b" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">🔄</span>
                <div className="flex flex-col">
                  <span>Llama 3.1 405B</span>
                  <span className="text-xs text-gray-400">Massive open model capabilities</span>
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
          
          <SelectGroup>
            <SelectLabel>Local Models</SelectLabel>
            <SelectItem value="local-llm" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white">💻</span>
                <div className="flex flex-col">
                  <span>Local LLM</span>
                  <span className="text-xs text-gray-400">Run models locally on your computer</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="ollama" className="py-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white">🐑</span>
                <div className="flex flex-col">
                  <span>Ollama</span>
                  <span className="text-xs text-gray-400">Local model runner</span>
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
