
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPickerProps, type CaptionProps } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface CustomCaptionProps extends CaptionProps {
  onMonthChange?: (month: Date) => void;
}

export function CustomCaption({ 
  displayMonth: month,
  id,
  onMonthChange 
}: CustomCaptionProps) {
  const months = React.useRef([
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]);
  
  // Calculate previous and next months
  const goToPreviousMonth = () => {
    const previousMonth = new Date(month);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    if (onMonthChange) {
      onMonthChange(previousMonth);
    }
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (onMonthChange) {
      onMonthChange(nextMonth);
    }
  };
  
  return (
    <div className="flex justify-center pt-1 relative items-center">
      <div className="space-x-1 flex items-center">
        <button
          onClick={goToPreviousMonth}
          type="button"
          aria-label="Go to previous month"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
      <div className="text-sm font-medium">
        {months.current[month.getMonth()]} {month.getFullYear()}
      </div>
      <div className="space-x-1 flex items-center">
        <button
          onClick={goToNextMonth}
          type="button"
          aria-label="Go to next month"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
