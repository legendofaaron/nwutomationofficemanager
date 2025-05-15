
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import type { CustomCaptionProps } from "./types"

export function CustomCaption({ 
  displayMonth, 
  onMonthChange,
  goToMonth,
  nextMonth,
  previousMonth
}: CustomCaptionProps) {
  // Handle month navigation
  const handlePreviousClick = () => {
    if (previousMonth) {
      goToMonth(previousMonth);
      if (onMonthChange) onMonthChange(previousMonth);
    }
  };

  const handleNextClick = () => {
    if (nextMonth) {
      goToMonth(nextMonth);
      if (onMonthChange) onMonthChange(nextMonth);
    }
  };

  return (
    <div className="flex w-full justify-between items-center px-2">
      <Button
        variant="outline"
        className="h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-full"
        disabled={!previousMonth}
        onClick={handlePreviousClick}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      <span className="text-sm font-medium">
        {format(displayMonth, 'MMMM yyyy')}
      </span>
      <Button
        variant="outline"
        className="h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-full"
        disabled={!nextMonth}
        onClick={handleNextClick}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );
}
