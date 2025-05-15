
import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';

/**
 * Custom hook to synchronize a local date state with the global calendar date
 * @param initialDate Optional initial date (defaults to the global calendar date or now)
 * @param syncMode Optional sync mode: 'bidirectional' (default) or 'readonly'
 * @returns Object with synchronized date state and setter function
 */
export function useCalendarSync(initialDate?: Date, syncMode: 'bidirectional' | 'readonly' = 'bidirectional') {
  const { calendarDate, setCalendarDate } = useAppContext();
  
  // Initialize with global date if available, fallback to provided initialDate or current date
  const [localDate, setLocalDate] = useState<Date>(
    calendarDate || initialDate || new Date()
  );
  
  // Sync from global to local - immediately respond to changes in global date
  useEffect(() => {
    if (calendarDate) {
      // Only update if dates are different (compare by day, not time)
      if (!localDate || calendarDate.toDateString() !== localDate.toDateString()) {
        setLocalDate(new Date(calendarDate));
      }
    }
  }, [calendarDate, localDate]);
  
  // Function to update both local and global state
  const updateDate = useCallback((newDate: Date | undefined) => {
    if (newDate) {
      // Create a fresh date object to avoid reference issues
      const freshDate = new Date(newDate);
      
      // Always update local date
      setLocalDate(freshDate);
      
      // Only update global date if in bidirectional mode
      if (syncMode === 'bidirectional') {
        setCalendarDate(freshDate);
      }
    }
  }, [setCalendarDate, syncMode]);
  
  // Add a direct access function to quickly create events
  const createEventOnDate = useCallback((date: Date, eventData: any) => {
    // Update the selected date
    updateDate(date);
    
    // Return the date and event data for further processing
    return { date, eventData };
  }, [updateDate]);
  
  return {
    date: localDate,
    setDate: updateDate,
    createEventOnDate
  };
}

export default useCalendarSync;
