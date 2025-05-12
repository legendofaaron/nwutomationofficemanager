
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, CaptionProps as DayPickerCaptionProps, DayPickerSingleProps, DayClickEventHandler } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";

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
  const { resolvedTheme } = useTheme();
  const isSuperDarkMode = resolvedTheme === 'superdark';
  
  return (
    <div className="flex items-center justify-between px-2 py-1">
      <button
        onClick={onPreviousClick}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-background hover:bg-muted p-0 opacity-90 hover:opacity-100",
          isSuperDarkMode && "bg-[#0A0A0A] border-[#181818] text-gray-300 hover:bg-[#111111]"
        )}
        aria-label="Previous month"
      >
        <ChevronLeft className={cn("h-4 w-4 text-primary", isSuperDarkMode && "text-gray-300")} />
      </button>
      
      <div className={cn("text-sm font-medium text-center", isSuperDarkMode && "text-gray-200")}>
        {format(displayMonth, 'MMMM yyyy')}
      </div>
      
      <button
        onClick={onNextClick}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-background hover:bg-muted p-0 opacity-90 hover:opacity-100",
          isSuperDarkMode && "bg-[#0A0A0A] border-[#181818] text-gray-300 hover:bg-[#111111]"
        )}
        aria-label="Next month"
      >
        <ChevronRight className={cn("h-4 w-4 text-primary", isSuperDarkMode && "text-gray-300")} />
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
  const { resolvedTheme } = useTheme();
  const { calendarDate, setCalendarDate } = useAppContext();
  const isSuperDarkMode = resolvedTheme === 'superdark';
  
  // Type guard to check if a value is a Date object
  const isDateObject = (value: any): value is Date => {
    return value instanceof Date;
  };

  // Synchronize with global calendar date if both selected and calendarDate exist but are different
  React.useEffect(() => {
    if (props.selected && calendarDate && 
        props.mode === "single" && 
        isDateObject(props.selected) && 
        isDateObject(calendarDate) && 
        props.selected.toDateString() !== calendarDate.toDateString()) {
      if (typeof props.onSelect === 'function') {
        // Fixed: Cast to appropriate handler type and provide necessary parameters
        const handler = props.onSelect as (date: Date | undefined, selectedDay: any, activeModifiers: any, e: any) => void;
        handler(calendarDate, null, {}, null);
      }
    }
  }, [calendarDate, props]);

  // Update global calendar date when this calendar's selected date changes
  const handleSelect = React.useCallback((date: Date | undefined, selectedDay: any, activeModifiers: any, e: any) => {
    if (date) {
      // Pass all required arguments to the original onSelect if it exists
      if ('onSelect' in props && typeof props.onSelect === 'function') {
        // Safely cast the handler and call it with all required arguments
        const handler = props.onSelect as (date: Date | undefined, selectedDay: any, activeModifiers: any, e: any) => void;
        handler(date, selectedDay, activeModifiers, e);
      }
      
      // Always update global calendar date for single mode calendars
      if (props.mode === "single" && isDateObject(date)) {
        setCalendarDate(date);
      }
    }
  }, [props, setCalendarDate]);
  
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
          cn(
            "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem] flex-shrink-0",
            isSuperDarkMode && "text-gray-500"
          ),
        row: "flex w-full mt-2",
        cell: "h-8 w-8 text-center text-sm p-0 relative flex-shrink-0 focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-xs cursor-pointer",
          isSuperDarkMode && "hover:bg-[#111111] text-gray-300"
        ),
        day_range_end: "day-range-end",
        day_selected:
          cn(
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            isSuperDarkMode && "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700"
          ),
        day_today: cn(
          "bg-accent text-accent-foreground",
          isSuperDarkMode && "bg-[#181818] text-blue-400 font-medium"
        ),
        day_outside:
          cn(
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            isSuperDarkMode && "text-gray-700"
          ),
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        // Fixed the type issue by properly handling the DayPickerCaptionProps
        Caption: ({ displayMonth }: DayPickerCaptionProps) => {
          // Create handlers for previous/next month navigation
          const handlePrevious = () => {
            const prevMonth = new Date(displayMonth);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            // Check if onMonthChange prop exists on the DayPicker
            if (props.onMonthChange) {
              props.onMonthChange(prevMonth);
            }
          };
          
          const handleNext = () => {
            const nextMonth = new Date(displayMonth);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            // Check if onMonthChange prop exists on the DayPicker
            if (props.onMonthChange) {
              props.onMonthChange(nextMonth);
            }
          };
          
          return (
            <CustomCaption 
              displayMonth={displayMonth} 
              onPreviousClick={handlePrevious}
              onNextClick={handleNext} 
            />
          );
        },
      }}
      selected={props.selected}
      // Type the onSelect handler correctly to avoid type mismatches
      onSelect={(date, selectedDay, activeModifiers, e) => {
        // Cast the date to the correct type before passing it to our handler
        if (date instanceof Date || date === undefined) {
          handleSelect(date, selectedDay, activeModifiers, e);
        } else if (Array.isArray(date)) {
          // Handle multiple dates if needed
          const firstDate = date[0];
          if (firstDate instanceof Date) {
            handleSelect(firstDate, selectedDay, activeModifiers, e);
          }
        } else if (date && typeof date === 'object' && 'from' in date) {
          // Handle range selection if needed
          const fromDate = date.from;
          if (fromDate instanceof Date) {
            handleSelect(fromDate, selectedDay, activeModifiers, e);
          }
        }
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
