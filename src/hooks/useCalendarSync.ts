
import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';

/**
 * Custom hook to synchronize a local date state with the global calendar date
 * @param initialDate Optional initial date (defaults to the global calendar date or now)
 * @returns Object with synchronized date state and setter function
 */
export function useCalendarSync(initialDate?: Date) {
  const { calendarDate, setCalendarDate } = useAppContext();
  const [localDate, setLocalDate] = useState<Date>(
    initialDate || calendarDate || new Date()
  );
  
  // Sync from global to local - immediately respond to changes
  useEffect(() => {
    if (calendarDate && (!localDate || calendarDate.toDateString() !== localDate.toDateString())) {
      setLocalDate(calendarDate);
    }
  }, [calendarDate, localDate]);
  
  // Function to update both local and global state
  const updateDate = useCallback((newDate: Date | undefined) => {
    if (newDate) {
      setLocalDate(newDate);
      setCalendarDate(newDate);
    }
  }, [setCalendarDate]);
  
  return {
    date: localDate,
    setDate: updateDate
  };
}

export default useCalendarSync;
