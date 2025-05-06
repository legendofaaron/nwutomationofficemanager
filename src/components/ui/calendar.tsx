
import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// Helper function to generate crew letter codes
export const getCrewLetterCode = (index: number): string => {
  // For the first 26 crews, use A-Z
  if (index < 26) {
    return String.fromCharCode(65 + index); // A = 65 in ASCII
  } 
  
  // For crews beyond 26, use A2, B2, C2, etc.
  const cycle = Math.floor(index / 26);
  const letter = String.fromCharCode(65 + (index % 26));
  return `${letter}${cycle + 1}`;
};

// Define a custom caption props interface that includes the navigation handlers
interface CustomCaptionProps {
  displayMonth: Date;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

// Custom caption component to show month and year with better styling
const CustomCaption = ({ displayMonth, onPreviousClick, onNextClick }: CustomCaptionProps) => {
  return (
    <div className="flex items-center justify-between px-2 py-1">
      <button
        onClick={onPreviousClick}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-background hover:bg-muted dark:bg-gray-800 p-0 opacity-90 hover:opacity-100"
        )}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4 text-primary dark:text-gray-300" />
      </button>
      
      <div className="text-sm font-medium text-center">
        {format(displayMonth, 'MMMM yyyy')}
      </div>
      
      <button
        onClick={onNextClick}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-background hover:bg-muted dark:bg-gray-800 p-0 opacity-90 hover:opacity-100"
        )}
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4 text-primary dark:text-gray-300" />
      </button>
    </div>
  );
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // Hide default caption label as we're using custom caption
        nav: "hidden", // Hide default nav as we're using custom caption
        nav_button: cn(
          "hidden" // Hide default nav buttons as we're using custom caption
        ),
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem] flex-shrink-0",
        row: "flex w-full mt-2",
        cell: "h-8 w-8 text-center text-sm p-0 relative flex-shrink-0 focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-xs"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: (props) => {
          // Type cast and pass the needed properties to our custom component
          return <CustomCaption 
            displayMonth={props.displayMonth} 
            onPreviousClick={() => props.onPreviousClick()} 
            onNextClick={() => props.onNextClick()} 
          />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
