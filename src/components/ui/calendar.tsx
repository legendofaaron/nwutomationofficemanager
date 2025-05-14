
// Re-export components and utilities from calendar module
export { Calendar } from './calendar/index';
export type { CalendarProps } from './calendar/index';
export { getCrewLetterCode } from './calendar/utils';
export type { CalendarDayProps } from './calendar/types';

// Import DateRange directly from react-day-picker
import { DateRange } from 'react-day-picker';
export type { DateRange };
