
import { DroppedItem } from './CalendarTypes';
import { Crew } from '@/components/schedule/ScheduleTypes';

export const getCrewLetterCode = (crewIndex: number): string => {
  return String.fromCharCode(65 + (crewIndex % 26));
};

export const getCrewDisplayCode = (crewId: string, crews: Crew[]): string => {
  const crewIndex = crews ? crews.findIndex(crew => crew.id === crewId) : -1;
  return crewIndex >= 0 ? getCrewLetterCode(crewIndex) : '';
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getTextByItemType = (item: DroppedItem): string => {
  switch(item.type) {
    case 'employee':
      return `Meeting with ${item.originalData?.name || item.text.split(' - ')[1]}`;
    case 'crew':
      return `Team meeting: ${item.originalData?.name || item.text.split(' - ')[1]}`;
    case 'invoice':
      return `Process invoice: ${item.text}`;
    case 'booking':
      return `Booking: ${item.text}`;
    default:
      return item.text;
  }
};

// Helper function to safely get toDateString from a date that might be a string
export const safeToDateString = (date: Date | string): string => {
  if (typeof date === 'string') {
    return new Date(date).toDateString();
  }
  return date.toDateString();
};

// Helper for comparing dates without time components 
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return d1.getFullYear() === d2.getFullYear() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getDate() === d2.getDate();
};

// Format a date as YYYY-MM-DD for consistent string representation
export const formatDateToYYYYMMDD = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Parse a YYYY-MM-DD string to Date
export const parseYYYYMMDDToDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to ensure a date is a proper Date object
export const ensureDate = (date: Date | string): Date => {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
};

// Helper to sync date between calendar components by normalizing the date
// This removes time components to make date comparison consistent
export const normalizeDate = (date: Date | string): Date => {
  const d = ensureDate(date);
  // Create a new date with just year, month, day (no time)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
