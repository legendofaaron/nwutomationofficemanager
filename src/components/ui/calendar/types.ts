
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
}

// Extended props for the custom caption component
export interface CustomCaptionProps extends CaptionProps {
  onPreviousClick: () => void;
  onNextClick: () => void;
  monthFormat?: string;
  displayIndex?: number;
  onMonthChange?: (date: Date) => void;
}
