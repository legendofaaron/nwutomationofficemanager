
import { DayClickEventHandler, SelectSingleEventHandler, SelectRangeEventHandler, SelectMultipleEventHandler, DayPicker } from "react-day-picker";
import { DateRange } from "react-day-picker";

// Define our own type for DayPicker props that takes into account the onSelect handler
// for different selection modes
export interface CalendarProps extends Omit<React.ComponentProps<typeof DayPicker>, 'onSelect' | 'mode' | 'selected'> {
  crew?: {
    name: string;
    startDate?: Date;
    id?: string;
  };
  date?: Date | Date[] | DateRange | undefined;
  onDateChange?: (date: Date) => void;
  onSelect?: SelectSingleEventHandler | SelectRangeEventHandler | SelectMultipleEventHandler;
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | DateRange | undefined;
  isRange?: boolean;
  isMultiple?: boolean;
  monthFormat?: string;
  id?: string;
  customCaption?: boolean;
}

// Define a custom caption props interface that includes the navigation handlers
export interface CustomCaptionProps {
  displayMonth: Date;
  onPreviousClick: () => void;
  onNextClick: () => void;
  monthFormat?: string;
  displayIndex?: number;
}
