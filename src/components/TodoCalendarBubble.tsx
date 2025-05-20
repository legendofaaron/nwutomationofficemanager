
import React, { useState } from 'react';
import TodoCalendar from './TodoCalendar';
import { useTheme } from '@/context/ThemeContext';
import { CalendarDays } from 'lucide-react';

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
      {/* Calendar button - sleek and professional design */}
      <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50">
        <button 
          onClick={toggleCalendar} 
          className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg 
            ${isDark || isSuperDark 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700'} 
            relative flex items-center justify-center transition-all duration-300
            text-white hover:shadow-xl hover:scale-105 active:scale-95`}
          aria-label="Toggle Calendar and Tasks"
        >
          <CalendarDays className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          
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
