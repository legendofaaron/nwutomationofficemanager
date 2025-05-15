
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { CustomCaptionProps } from './types';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const CustomCaption: React.FC<CustomCaptionProps> = ({ 
  displayMonth, 
  onMonthChange,
  goToMonth,
  nextMonth,
  previousMonth
}) => {
  const handlePreviousMonth = () => {
    if (previousMonth && onMonthChange) {
      onMonthChange(previousMonth);
    }
    if (previousMonth && goToMonth) {
      goToMonth(previousMonth);
    }
  };
  
  const handleNextMonth = () => {
    if (nextMonth && onMonthChange) {
      onMonthChange(nextMonth);
    }
    if (nextMonth && goToMonth) {
      goToMonth(nextMonth);
    }
  };

  return (
    <div className="flex justify-center pt-1 relative items-center">
      <button
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
        )}
        onClick={handlePreviousMonth}
        type="button"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </button>
      
      <h2 className="text-sm font-medium">
        {format(displayMonth, 'MMMM yyyy')}
      </h2>
      
      <button
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
        )}
        onClick={handleNextMonth}
        type="button"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </button>
    </div>
  );
};
