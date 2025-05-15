
import { CaptionProps, DayPickerProps } from "react-day-picker";

export interface CalendarDayProps {
  date: Date;
  selected?: boolean;
  disabled?: boolean;
}

// Enhanced CustomCaptionProps to have all needed properties
export interface CustomCaptionProps {
  displayMonth: Date;
  onMonthChange?: (date: Date) => void;
  goToMonth?: (date: Date) => void;
  nextMonth?: Date;
  previousMonth?: Date;
}
