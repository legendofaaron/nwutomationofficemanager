
import * as React from "react";
import { DayPicker, type DayPickerRangeProps, type DayPickerSingleProps, type DayPickerMultipleProps, type DayPickerDefaultProps, CaptionProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCaptionProps } from "./types";
import { getCrewLetterCode } from "./utils";

// Create re-usable components for DayPicker
const IconLeft = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("flex h-7 w-7 items-center justify-center rounded-md", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </button>
));
IconLeft.displayName = "IconLeft";

const IconRight = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("flex h-7 w-7 items-center justify-center rounded-md", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </button>
));
IconRight.displayName = "IconRight";

// Custom caption component
function CustomCaption(props: CustomCaptionProps) {
  const { monthFormat = "MMMM", displayMonth, onPreviousClick, onNextClick } = props;

  const months = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex gap-1">
        <Select
          value={displayMonth.getMonth().toString()}
          onValueChange={(value) => {
            const newDate = new Date(displayMonth);
            newDate.setMonth(parseInt(value));
            if (typeof props.onMonthChange === 'function') {
              props.onMonthChange(newDate);
            }
          }}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={displayMonth.getFullYear().toString()}
          onValueChange={(value) => {
            const newDate = new Date(displayMonth);
            newDate.setFullYear(parseInt(value));
            if (typeof props.onMonthChange === 'function') {
              props.onMonthChange(newDate);
            }
          }}
        >
          <SelectTrigger className="h-8 w-[90px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onPreviousClick}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <IconLeft />
        </button>
        <button
          onClick={onNextClick}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <IconRight />
        </button>
      </div>
    </div>
  );
}

// Custom footer component - can be used for any additional info
const CustomFooter = () => {
  return null;
};

// Modified Calendar component
export function Calendar<T extends boolean | Date | Date[]>({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps<T>) {
  // Helper to check mode type
  const isRange = props.mode === "range";
  const isMultiple = props.mode === "multiple";
  
  // Handle the selection based on mode
  const handleOnSelect = (
    newDate: Date | Date[] | DateRange | undefined,
    dummyEvent: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!newDate) return;
    
    // Handle based on selection mode
    if (isRange && Array.isArray(newDate)) {
      // Range date selection
      const rangeHandler = props.onSelect as SelectRangeEventHandler;
      if (rangeHandler && newDate.length === 2) {
        const range = { from: newDate[0], to: newDate[1] };
        // Fix for TypeScript error: Using the Simplified API (2 arguments)
        rangeHandler(range, undefined as any);
      }
    } else if (isMultiple) {
      // Multiple date selection
      const multiHandler = props.onSelect as SelectMultipleEventHandler;
      if (multiHandler) {
        // Fix for TypeScript error: Using the Simplified API (2 arguments)
        multiHandler(newDate as Date[], undefined as any);
      }
    } else if (newDate instanceof Date) {
      // Single date selection
      // Call the original onSelect handler if provided
      if (props.onSelect) {
        const singleSelectHandler = props.onSelect as SelectSingleEventHandler;
        // Fix for TypeScript error: Using the Simplified API (2 arguments)
        singleSelectHandler(newDate, undefined as any);
      }
    }
  };

  // Build other props to pass to DayPicker
  const otherProps = { ...props, onSelect: handleOnSelect };
  
  // Define month format for the custom caption
  const monthFormat = "MMMM";

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
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
        Caption: (captionProps: CaptionProps) => (
          <CustomCaption 
            {...captionProps} 
            monthFormat={monthFormat}
            onPreviousClick={() => {
              if (captionProps.displayMonth) {
                const prevMonth = new Date(
                  captionProps.displayMonth.getFullYear(),
                  captionProps.displayMonth.getMonth() - 1
                );
                // Use DayPicker's built-in navigation instead of accessing nav directly
                if (typeof otherProps.onMonthChange === 'function') {
                  otherProps.onMonthChange(prevMonth);
                }
              }
            }}
            onNextClick={() => {
              if (captionProps.displayMonth) {
                const nextMonth = new Date(
                  captionProps.displayMonth.getFullYear(),
                  captionProps.displayMonth.getMonth() + 1
                );
                // Use DayPicker's built-in navigation instead of accessing nav directly
                if (typeof otherProps.onMonthChange === 'function') {
                  otherProps.onMonthChange(nextMonth);
                }
              }
            }}
            onMonthChange={otherProps.onMonthChange}
          />
        ),
        Footer: CustomFooter
      }}
      {...otherProps}
    />
  );
}

// Define the types for props
export interface CalendarProps<T extends boolean | Date | Date[]>
  extends React.ComponentProps<typeof DayPicker> {
    mode?: "single" | "multiple" | "range";
    selected?: T;
}

// Type for selection handler functions
export type SelectSingleEventHandler = (date: Date, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
export type SelectRangeEventHandler = (range: { from: Date; to?: Date } | undefined, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
export type SelectMultipleEventHandler = (dates: Date[], event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
export type DateRange = { from: Date; to?: Date };
