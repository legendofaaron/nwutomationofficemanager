
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppContext } from './AppContext';

interface CalendarSyncContextType {
  globalDate: Date;
  setGlobalDate: (date: Date) => void;
  lastDragOperation: {
    itemType: string;
    itemId: string;
    sourceId: string;
    targetDate: Date | null;
    timestamp: number;
  } | null;
  setLastDragOperation: (operation: {
    itemType: string;
    itemId: string;
    sourceId: string;
    targetDate: Date | null;
    timestamp: number;
  } | null) => void;
  draggingItem: {
    type: string;
    id: string;
    data: any;
  } | null;
  setDraggingItem: (item: {
    type: string;
    id: string;
    data: any;
  } | null) => void;
  registerCalendar: (id: string, onDateChange: (date: Date) => void) => void;
  unregisterCalendar: (id: string) => void;
}

const CalendarSyncContext = createContext<CalendarSyncContextType | undefined>(undefined);

export const CalendarSyncProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { calendarDate, setCalendarDate } = useAppContext();
  const [globalDate, setGlobalDateInternal] = useState<Date>(calendarDate || new Date());
  const [lastDragOperation, setLastDragOperation] = useState<{
    itemType: string;
    itemId: string;
    sourceId: string;
    targetDate: Date | null;
    timestamp: number;
  } | null>(null);
  const [draggingItem, setDraggingItem] = useState<{
    type: string;
    id: string;
    data: any;
  } | null>(null);
  
  const [registeredCalendars, setRegisteredCalendars] = useState<{
    [key: string]: (date: Date) => void
  }>({});
  
  // Sync with app context
  useEffect(() => {
    if (calendarDate && calendarDate.toDateString() !== globalDate.toDateString()) {
      setGlobalDateInternal(calendarDate);
    }
  }, [calendarDate, globalDate]);
  
  const setGlobalDate = (date: Date) => {
    setGlobalDateInternal(date);
    setCalendarDate(date);
    
    // Notify all registered calendars
    Object.values(registeredCalendars).forEach(callback => {
      callback(date);
    });
  };
  
  const registerCalendar = (id: string, onDateChange: (date: Date) => void) => {
    setRegisteredCalendars(prev => ({
      ...prev,
      [id]: onDateChange
    }));
  };
  
  const unregisterCalendar = (id: string) => {
    setRegisteredCalendars(prev => {
      const newCalendars = { ...prev };
      delete newCalendars[id];
      return newCalendars;
    });
  };
  
  return (
    <CalendarSyncContext.Provider value={{
      globalDate,
      setGlobalDate,
      lastDragOperation,
      setLastDragOperation,
      draggingItem,
      setDraggingItem,
      registerCalendar,
      unregisterCalendar
    }}>
      {children}
    </CalendarSyncContext.Provider>
  );
};

export const useCalendarSync = () => {
  const context = useContext(CalendarSyncContext);
  if (!context) {
    throw new Error('useCalendarSync must be used within a CalendarSyncProvider');
  }
  return context;
};
