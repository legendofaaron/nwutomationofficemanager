
import { CaptionProps } from "react-day-picker";

// Types for the task dots that can be shown on calendar days
export interface TaskDot {
  color: string;
  tooltip?: string;
}

// Props for calendar day component
export interface CalendarDayProps {
  date: Date;
  selected?: boolean;
  disabled?: boolean;
  inMonth?: boolean;
  tasks?: TaskDot[];
}

// Extended props for the custom caption component
export interface CustomCaptionProps extends Partial<CaptionProps> {
  displayMonth: Date;
  onMonthChange?: (date: Date) => void;
  goToMonth?: (date: Date) => void;
  nextMonth?: Date;
  previousMonth?: Date;
}
