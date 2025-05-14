
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

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
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      <button 
        onClick={handleToggleAiAssistant} 
        className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg ${isDark || isSuperDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} 
        relative flex items-center justify-center transition-colors text-white hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200`}
        aria-label="Toggle AI Assistant"
      >
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
        {aiAssistantOpen && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
        )}
      </button>
    </div>
  );
};
