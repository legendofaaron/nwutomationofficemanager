
import React, { useState } from 'react';
import TodoCalendar from './TodoCalendar';
import { Calendar } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '@/context/ThemeContext';

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
      {/* Calendar button - styled similar to AI Assistant button */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <button 
          onClick={toggleCalendar} 
          className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg ${isDark || isSuperDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} 
          relative flex items-center justify-center transition-colors text-white hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200`}
          aria-label="Toggle Calendar and Tasks"
        >
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
          {isCalendarOpen && (
            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Only render the calendar if it's open */}
      {isCalendarOpen && <TodoCalendar />}
    </>
  );
};

export default TodoCalendarBubble;
