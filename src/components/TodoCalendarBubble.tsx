
import React, { useState } from 'react';
import TodoCalendar from './TodoCalendar';
import { useTheme } from '@/context/ThemeContext';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

const TodoCalendarBubble: React.FC = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return (
    <>
      {/* Calendar button - redesigned for a more professional look */}
      <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50">
        <button 
          onClick={toggleCalendar} 
          className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg relative flex items-center justify-center transition-all duration-300",
            isDark || isSuperDark 
              ? "bg-[#1E2937] hover:bg-[#1A2433] border border-primary/20" 
              : "bg-primary hover:bg-primary/90 text-white",
            "hover:shadow-xl hover:scale-105 active:scale-95"
          )}
          aria-label="Toggle Calendar and Tasks"
        >
          <CalendarDays className="h-6 w-6 sm:h-7 sm:w-7" />
          
          {isCalendarOpen && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
          )}
        </button>
      </div>

      {/* Only render the calendar if it's open */}
      {isCalendarOpen && <TodoCalendar />}
    </>
  );
};

export default TodoCalendarBubble;
