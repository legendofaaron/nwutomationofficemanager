
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
