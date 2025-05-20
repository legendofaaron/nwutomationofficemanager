
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
          <div className="relative w-8 h-8 sm:w-9 sm:h-9">
            {/* Calendar icon matching the provided image */}
            <div className="w-full h-full rounded-lg bg-[#1B1F2C] flex flex-col items-center justify-center overflow-hidden">
              {/* White top portion with blue tabs */}
              <div className="w-full h-2/5 bg-white flex justify-between items-start">
                {/* Left blue tab */}
                <div className="h-3 w-2 bg-[#3179E4] rounded-b-full mx-1"></div>
                {/* Right blue tab */}
                <div className="h-3 w-2 bg-[#3179E4] rounded-b-full mx-1"></div>
              </div>
              
              {/* Dark bottom portion with hexagon */}
              <div className="w-full h-3/5 bg-[#1B1F2C] flex items-center justify-center">
                {/* Outer hexagon */}
                <div className="relative">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3179E4" strokeWidth="2.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                  
                  {/* Inner hexagon */}
                  <svg 
                    width="10" 
                    height="10" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#3179E4" 
                    strokeWidth="2.5"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) scale(0.7)'
                    }}
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
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
