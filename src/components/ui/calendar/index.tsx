import * as React from "react";
import { DayPicker, CaptionProps as DayPickerCaptionProps, SelectSingleEventHandler, SelectRangeEventHandler, SelectMultipleEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";
import { CalendarProps } from "./types";
import { CustomCaption } from "./CustomCaption";
import { isDateObject } from "./utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { resolvedTheme } = useTheme();
  const { calendarDate, setCalendarDate } = useAppContext();
  const isSuperDarkMode = resolvedTheme === 'superdark';

  // Synchronize with global calendar date if both selected and calendarDate exist but are different
  React.useEffect(() => {
    if (props.selected && calendarDate && 
        props.mode === "single" && 
        isDateObject(props.selected) && 
        isDateObject(calendarDate) && 
        props.selected.toDateString() !== calendarDate.toDateString()) {
      if (typeof props.onSelect === 'function' && props.mode === "single") {
        // We know this is a single select handler in this case
        const handler = props.onSelect as SelectSingleEventHandler;
        // Create proper modifiers according to the DayPicker API
        const modifiers = { today: calendarDate.toDateString() === new Date().toDateString() };
        const activeModifiers = { selected: true };
        handler(calendarDate, modifiers, activeModifiers, new MouseEvent('click'));
      }
    }
  }, [calendarDate, props]);

  // Update global calendar date when this calendar's selected date changes
  const handleSingleSelect = React.useCallback<SelectSingleEventHandler>((day, modifiers, activeModifiers, e) => {
    if (day) {
      // Pass the date to the original onSelect if it exists and is for single mode
      if (typeof props.onSelect === 'function' && props.mode === "single") {
        const handler = props.onSelect as SelectSingleEventHandler;
        handler(day, modifiers, activeModifiers, e);
      }
      
      // Always update global calendar date for single mode calendars
      if (props.mode === "single") {
        setCalendarDate(day);
      }
    }
  }, [props, setCalendarDate]);

  // Pass-through handler for range selection
  const handleRangeSelect = React.useCallback<SelectRangeEventHandler>((range, selectedDay, activeModifiers, e) => {
    if (typeof props.onSelect === 'function' && props.mode === "range") {
      const handler = props.onSelect as SelectRangeEventHandler;
      handler(range, selectedDay, activeModifiers, e);
    }
  }, [props]);

  // Pass-through handler for multiple selection
  const handleMultipleSelect = React.useCallback<SelectMultipleEventHandler>((dates, selectedDay, activeModifiers, e) => {
    if (typeof props.onSelect === 'function' && props.mode === "multiple") {
      const handler = props.onSelect as SelectMultipleEventHandler;
      handler(dates, selectedDay, activeModifiers, e);
    }
  }, [props]);
  
  // Generate the appropriate onSelect handler based on the mode
  const dayPickerOnSelectHandler = React.useMemo(() => {
    if (props.mode === "range") {
      return handleRangeSelect;
    } else if (props.mode === "multiple") {
      return handleMultipleSelect;
    } else {
      return handleSingleSelect;
    }
  }, [handleSingleSelect, handleMultipleSelect, handleRangeSelect, props.mode]);

  // Create properly typed props object based on mode
  // This helps TypeScript understand that our props are valid for all modes
  const dayPickerProps = {
    showOutsideDays,
    className: cn("p-3 pointer-events-auto", className),
    classNames: {
      // ... keep existing code (classNames property)
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
    },
    components: {
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
      ...props.components,
    },
    ...props
  };
  
  // Apply the appropriate type assertion based on the mode
  if (props.mode === "range") {
    return <DayPicker {...dayPickerProps} mode="range" onSelect={dayPickerOnSelectHandler as SelectRangeEventHandler} />;
  } else if (props.mode === "multiple") {
    return <DayPicker {...dayPickerProps} mode="multiple" onSelect={dayPickerOnSelectHandler as SelectMultipleEventHandler} />;
  } else {
    return <DayPicker {...dayPickerProps} mode="single" onSelect={dayPickerOnSelectHandler as SelectSingleEventHandler} />;
  }
}
Calendar.displayName = "Calendar";

export { Calendar };
export * from './types';
export * from './utils';
