
import React from 'react';
import { Atom } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface AiAssistantButtonProps {
  aiAssistantOpen: boolean;
  handleToggleAiAssistant: () => void;
}

export const AiAssistantButton: React.FC<AiAssistantButtonProps> = ({
  aiAssistantOpen,
  handleToggleAiAssistant
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';

  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50">
      <button 
        onClick={handleToggleAiAssistant} 
        className={cn(
          "h-12 w-12 rounded-l-full shadow-lg",
          "flex items-center justify-center transition-all duration-300",
          "hover:shadow-xl active:scale-95",
          "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-y border-l border-blue-700"
        )}
        aria-label="AI Assistant"
      >
        <Atom className="h-6 w-6 text-white" />
        {aiAssistantOpen && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-blue-300 rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
};
