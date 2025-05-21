
import { useState, useCallback } from 'react';

export const useChatSidebar = () => {
  const [activeTool, setActiveTool] = useState<string | null>('chat');

  const handleToolChange = useCallback((tool: string) => {
    setActiveTool(tool);
  }, []);

  return {
    activeTool,
    handleToolChange
  };
};
