
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
  children?: React.ReactNode;
  dragHighlight?: boolean; // Added this prop for drag highlight state
}

// Extended props for the custom caption component
export interface CustomCaptionProps extends CaptionProps {
  onMonthChange?: (date: Date) => void;
  // The following are already included in CaptionProps from react-day-picker
  // decreaseMonth: () => void;
  // increaseMonth: () => void;
}
