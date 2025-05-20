
import React, { useState } from 'react';
import TodoCalendar from './TodoCalendar';
import { X, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TodoCalendarBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div 
      className={cn(
        "fixed top-20 sm:top-24 right-4 sm:right-6 z-40 shadow-lg rounded-lg transition-all duration-300 bg-gray-900 dark:bg-gray-900",
        !isOpen && "w-11 h-11 rounded-full bg-blue-600 dark:bg-blue-600 cursor-pointer"
      )}
      onClick={() => !isOpen && setIsOpen(true)}
      data-calendar
    >
      {isOpen ? (
        <div className="w-80 rounded-lg overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground" 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <TodoCalendar />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ChevronUp className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default TodoCalendarBubble;
