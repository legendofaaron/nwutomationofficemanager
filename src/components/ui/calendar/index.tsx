
import * as React from "react"
import { DayPicker, type DayPickerProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CustomCaption } from "./CustomCaption"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(props.month || new Date())
  
  // Handle month change for custom navigation
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    if (props.onMonthChange) {
      props.onMonthChange(newMonth);
    }
  };
  
  // Functions to increase and decrease month
  const decreaseMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    handleMonthChange(newMonth);
  };

  const increaseMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    handleMonthChange(newMonth);
  };
  
  return (
    <DayPicker
      month={currentMonth}
      onMonthChange={handleMonthChange}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto bg-[#2A2A2A] rounded-md", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-[#AAAAAA]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-[#3A3A3A] p-0 opacity-70 hover:opacity-100 text-[#DDDDDD] border-[#505050]"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-[#BBBBBB] rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[#3A3A3A]/50 [&:has([aria-selected])]:bg-[#3A3A3A] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-[#DDDDDD] hover:bg-[#404040] focus:bg-[#404040]"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-[#4A4A4A] text-[#FFFFFF] hover:bg-[#5A5A5A] hover:text-[#FFFFFF] focus:bg-[#5A5A5A] focus:text-[#FFFFFF]",
        day_today: "bg-[#3A3A3A] text-[#FFFFFF] font-semibold",
        day_outside: "day-outside text-[#888888] opacity-50 aria-selected:bg-[#3A3A3A]/50 aria-selected:text-[#AAAAAA] aria-selected:opacity-30",
        day_disabled: "text-[#777777] opacity-30",
        day_range_middle: "aria-selected:bg-[#3A3A3A] aria-selected:text-[#DDDDDD]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: (captionProps) => (
          <CustomCaption 
            displayMonth={captionProps.displayMonth} 
            decreaseMonth={decreaseMonth}
            increaseMonth={increaseMonth}
            onMonthChange={handleMonthChange}
          />
        ),
        ...props.components
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
