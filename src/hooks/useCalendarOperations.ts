
import { useCallback, useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { format } from 'date-fns';

/**
 * Custom hook for managing calendar date operations
 * 
 * Provides functionality for keeping dates in sync between 
 * different parts of the application and handling date selection
 */
export function useCalendarOperations(initialDate?: Date) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const { calendarDate, setCalendarDate } = useAppContext();
  const { date, setDate } = useCalendarSync(selectedDate);

  // Sync with app context
  useEffect(() => {
    if (calendarDate && calendarDate.toDateString() !== selectedDate.toDateString()) {
      setSelectedDate(calendarDate);
    }
  }, [calendarDate, selectedDate]);

  // Sync with calendar sync hook
  useEffect(() => {
    if (date && date.toDateString() !== selectedDate.toDateString()) {
      setSelectedDate(date);
    }
  }, [date, selectedDate]);

  // Handle date selection with a single click - memoized
  const handleSelectDate = useCallback((date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setDate(date);
      setCalendarDate(date);
    }
  }, [setDate, setCalendarDate]);

  // Format date for display - memoized
  const formattedDate = useCallback((date: Date, formatStr: string = 'MMMM d, yyyy') => {
    return format(date, formatStr);
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    handleSelectDate,
    formattedDate
  };
}
