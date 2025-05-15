
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CustomCaptionProps } from "./types";

export function CustomCaption({
  displayMonth,
  onMonthChange,
  goToMonth,
  nextMonth,
  previousMonth,
}: CustomCaptionProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <Button
        variant="ghost"
        className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        onClick={() => previousMonth && (goToMonth ? goToMonth(previousMonth) : onMonthChange?.(previousMonth))}
        disabled={!previousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      <span className="text-sm font-medium">
        {format(displayMonth, "MMMM yyyy")}
      </span>
      <Button
        variant="ghost"
        className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        onClick={() => nextMonth && (goToMonth ? goToMonth(nextMonth) : onMonthChange?.(nextMonth))}
        disabled={!nextMonth}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );
}
