
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { type CaptionProps, useNavigation } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface CustomCaptionProps extends CaptionProps {
  onMonthChange: (date: Date) => void;
}

export function CustomCaption(props: CustomCaptionProps) {
  const { displayMonth, onMonthChange } = props;
  const { goToMonth, nextMonth, previousMonth } = useNavigation();

  // Format the month and year for display
  const formattedMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(displayMonth);

  const handlePreviousClick = () => {
    if (previousMonth) {
      goToMonth(previousMonth);
      onMonthChange(previousMonth);
    }
  };

  const handleNextClick = () => {
    if (nextMonth) {
      goToMonth(nextMonth);
      onMonthChange(nextMonth);
    }
  };

  return (
    <div className="flex justify-center pt-1 relative items-center">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={handlePreviousClick}
          disabled={!previousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </button>
        
        <div className="text-sm font-medium">
          {formattedMonth}
        </div>
        
        <button
          onClick={handleNextClick}
          disabled={!nextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          )}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </button>
      </div>
    </div>
  );
}
