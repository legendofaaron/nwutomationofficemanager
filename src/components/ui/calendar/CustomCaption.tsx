
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
  // Format the month name and year in the format "May 2025"
  const formattedMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(displayMonth);

  return (
    <div className="flex items-center justify-center w-full px-6">
      <button
        onClick={(e) => {
          e.preventDefault();
          decreaseMonth();
        }}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-9 w-9 bg-[#2A2A2A] p-0 rounded-full opacity-90 hover:opacity-100 text-[#DDDDDD] border-[#444444]"
        )}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h2 className="flex-1 text-center text-md font-medium text-[#EEEEEE] px-4">
        {formattedMonth}
      </h2>
      <button
        onClick={(e) => {
          e.preventDefault();
          increaseMonth();
        }}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-9 w-9 bg-[#2A2A2A] p-0 rounded-full opacity-90 hover:opacity-100 text-[#DDDDDD] border-[#444444]"
        )}
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
