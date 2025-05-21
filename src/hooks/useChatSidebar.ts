
import { useState, useCallback } from 'react';

export const useChatSidebar = () => {
  const [activeTool, setActiveTool] = useState<string | null>('chat');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');

  const handleToolChange = useCallback((tool: string) => {
    setActiveTool(tool);
  }, []);

  const handleModelChange = useCallback((model: string) => {
    setSelectedModel(model);
  }, []);

  return {
    activeTool,
    handleToolChange,
    selectedModel,
    handleModelChange
  };
};
