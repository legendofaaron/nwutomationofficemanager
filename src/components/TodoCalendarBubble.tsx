
import React, { useState } from 'react';
import TodoCalendar from './TodoCalendar';
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
          <div className="relative w-6 h-6 sm:w-7 sm:h-7">
            {/* Custom calendar icon with hexagon */}
            <div className="w-full h-full rounded-md bg-white flex items-center justify-center overflow-hidden">
              <div className="w-full h-3/5 mt-[-3px] flex flex-col items-center">
                {/* Two blue tabs at the top */}
                <div className="flex w-full justify-between px-[2px]">
                  <div className="h-[4px] w-[4px] bg-blue-500 rounded-full"></div>
                  <div className="h-[4px] w-[4px] bg-blue-500 rounded-full"></div>
                </div>
                
                {/* Hexagon in the center */}
                <div className="relative mt-[2px] flex items-center justify-center w-full">
                  <div className="h-[12px] w-[12px] sm:h-[14px] sm:w-[14px] text-blue-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                  </div>
                  <div className="absolute h-[8px] w-[8px] sm:h-[10px] sm:w-[10px] text-blue-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
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
