
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomCaptionProps {
  displayMonth: Date;
  onMonthChange?: (date: Date) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
}

export function CustomCaption({ displayMonth, decreaseMonth, increaseMonth, onMonthChange }: CustomCaptionProps) {
  // Format the month name and year
  const formattedMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(displayMonth);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={(e) => {
          e.preventDefault();
          decreaseMonth();
        }}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-[#3A3A3A] p-0 opacity-75 hover:opacity-100 text-[#DDDDDD] border-[#505050]"
        )}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <h2 className="text-center text-sm font-medium text-[#DDDDDD]">
        {formattedMonth}
      </h2>
      <button
        onClick={(e) => {
          e.preventDefault();
          increaseMonth();
        }}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-[#3A3A3A] p-0 opacity-75 hover:opacity-100 text-[#DDDDDD] border-[#505050]"
        )}
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
