
import { DayClickEventHandler, SelectSingleEventHandler, SelectRangeEventHandler, SelectMultipleEventHandler } from "react-day-picker";
import { DayPicker } from "react-day-picker";

// Define our own type for DayPicker props that takes into account the onSelect handler
// for different selection modes
export interface CalendarProps extends Omit<React.ComponentProps<typeof DayPicker>, 'onSelect'> {
  onSelect?: SelectSingleEventHandler | SelectRangeEventHandler | SelectMultipleEventHandler;
}

// Define a custom caption props interface that includes the navigation handlers
export interface CustomCaptionProps {
  displayMonth: Date;
  onPreviousClick: () => void;
  onNextClick: () => void;
}
