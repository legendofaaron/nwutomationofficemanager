
import { DayClickEventHandler, SelectSingleEventHandler, SelectRangeEventHandler, SelectMultipleEventHandler, DayPicker } from "react-day-picker";
import { DateRange } from "react-day-picker";

// Define our own type for DayPicker props that takes into account the onSelect handler
// for different selection modes
export interface CalendarProps extends Omit<React.ComponentProps<typeof DayPicker>, 'onSelect' | 'mode' | 'selected'> {
  onSelect?: SelectSingleEventHandler | SelectRangeEventHandler | SelectMultipleEventHandler;
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | DateRange | undefined;
}

// Define a custom caption props interface that includes the navigation handlers
export interface CustomCaptionProps {
  displayMonth: Date;
  onPreviousClick: () => void;
  onNextClick: () => void;
}
