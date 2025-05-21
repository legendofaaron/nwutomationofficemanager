
import React from 'react';
import { MessageSquare } from 'lucide-react';
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
    <div className="fixed bottom-20 left-4 sm:left-6 z-50">
      <button 
        onClick={handleToggleAiAssistant} 
        className={cn(
          "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg",
          "relative flex items-center justify-center transition-colors",
          "hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200",
          isDark || isSuperDark 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "bg-blue-600 text-white hover:bg-blue-700"
        )}
        aria-label="AI Assistant"
      >
        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
        {aiAssistantOpen && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
        )}
      </button>
    </div>
  );
};
