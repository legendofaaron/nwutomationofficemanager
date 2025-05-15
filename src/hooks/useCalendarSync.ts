
import { useState, useEffect, useCallback, useId } from 'react';
import { useCalendarSync as useCalendarSyncContext } from '@/context/CalendarSyncContext';

/**
 * Enhanced hook to synchronize a local date state with the global calendar date
 * @param initialDate Optional initial date (defaults to the global calendar date or now)
 * @param syncMode Optional sync mode: 'bidirectional' (default) or 'readonly'
 * @returns Object with synchronized date state and setter function
 */
export function useCalendarSync(initialDate?: Date, syncMode: 'bidirectional' | 'readonly' = 'bidirectional') {
  const { globalDate, setGlobalDate, registerCalendar, unregisterCalendar } = useCalendarSyncContext();
  const calendarId = useId();
  
  // Initialize with global date if available, fallback to provided initialDate or current date
  const [localDate, setLocalDate] = useState<Date>(
    initialDate || globalDate || new Date()
  );
  
  // Register this calendar instance
  useEffect(() => {
    registerCalendar(calendarId, (date) => {
      setLocalDate(new Date(date));
    });
    
    return () => {
      unregisterCalendar(calendarId);
    };
  }, [calendarId, registerCalendar, unregisterCalendar]);
  
  // Sync from global to local - immediately respond to changes in global date
  useEffect(() => {
    if (globalDate && globalDate.toDateString() !== localDate.toDateString()) {
      setLocalDate(new Date(globalDate));
    }
  }, [globalDate, localDate]);
  
  // Function to update both local and global state
  const updateDate = useCallback((newDate: Date | undefined) => {
    if (newDate) {
      // Create a fresh date object to avoid reference issues
      const freshDate = new Date(newDate);
      
      // Always update local date
      setLocalDate(freshDate);
      
      // Only update global date if in bidirectional mode
      if (syncMode === 'bidirectional') {
        setGlobalDate(freshDate);
      }
    }
  }, [setGlobalDate, syncMode]);
  
  return {
    date: localDate,
    setDate: updateDate,
    calendarId
  };
}

export default useCalendarSync;
