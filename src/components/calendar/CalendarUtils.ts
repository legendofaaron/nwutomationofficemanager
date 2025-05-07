
import { Crew } from '@/components/schedule/ScheduleTypes';

// Format date to string in YYYY-MM-DD format
export function formatDateToYYYYMMDD(date: Date): string {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return new Date().toISOString().split('T')[0]; // Fallback to today
  }
}

// Format date string for comparison
export function safeToDateString(date: Date | string): string {
  if (typeof date === 'string') {
    // Try to parse as ISO string first
    try {
      return formatDateToYYYYMMDD(new Date(date));
    } catch (e) {
      console.error("Error parsing date string:", e);
      return date;
    }
  }
  try {
    return formatDateToYYYYMMDD(date);
  } catch (e) {
    console.error("Error formatting date:", e);
    return new Date().toISOString().split('T')[0]; // Fallback to today
  }
}

// Check if two dates are the same day
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  try {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    
    // Use timestamp comparison of normalized dates for better reliability
    return normalizeDate(d1).getTime() === normalizeDate(d2).getTime();
  } catch (e) {
    console.error("Date comparison error:", e);
    return false;
  }
}

// Get crew code for display
export function getCrewDisplayCode(crewId: string, crews: Crew[] = []): string {
  const crew = crews.find(c => c.id === crewId);
  return crew ? crew.name.substring(0, 3).toUpperCase() : crewId.substring(0, 3);
}

// Get appropriate text for different dragged item types
export function getTextByItemType(item: { type: string; text: string; id: string }): string {
  switch (item.type) {
    case 'employee':
      return `Task for ${item.text.split(' - ')[1] || item.text}`;
    case 'crew':
      return `Team event for ${item.text.split(' - ')[1] || item.text}`;
    case 'invoice':
      return `Review invoice #${item.id}`;
    case 'booking':
      return `Booking #${item.id}`;
    default:
      return item.text;
  }
}

// Capitalize first letter of a string
export function capitalizeFirstLetter(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Helper function to ensure we're working with Date objects
export function ensureDate(date: Date | string): Date {
  try {
    if (date instanceof Date) {
      return new Date(date.getTime()); // Create a copy to avoid reference issues
    }
    return new Date(date);
  } catch (e) {
    console.error("Error converting to Date:", e);
    return new Date(); // Return current date as fallback
  }
}

// Normalize date by setting time to midnight to avoid comparison issues
export function normalizeDate(date: Date | string): Date {
  try {
    const d = ensureDate(date);
    d.setHours(0, 0, 0, 0);
    return d;
  } catch (e) {
    console.error("Date normalization error:", e);
    return new Date(0); // Return epoch start as fallback
  }
}

// Create a stable date string for use as keys or IDs
export function getStableDateKey(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  } catch (e) {
    console.error("Error creating date key:", e);
    return "invalid-date";
  }
}
