
import { CaptionProps } from "react-day-picker";
import { DayPickerProps } from "react-day-picker";

export interface CalendarDayProps {
  date: Date;
  selected?: boolean;
  disabled?: boolean;
}

export interface CustomCaptionProps {
  displayMonth: Date;
  onMonthChange?: (date: Date) => void;
  goToMonth?: (date: Date) => void;
  nextMonth?: Date;
  previousMonth?: Date;
}
