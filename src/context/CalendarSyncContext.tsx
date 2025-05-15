
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Type definitions for the context
interface CalendarCallbacks {
  [id: string]: (date: Date) => void;
}

interface DragOperation {
  itemType: string;
  itemId: string;
  sourceId: string;
  targetDate: Date | null;
  timestamp: number;
}

interface CalendarSyncContextType {
  globalDate: Date | null;
  setGlobalDate: (date: Date) => void;
  registerCalendar: (id: string, onDateChange: (date: Date) => void) => void;
  unregisterCalendar: (id: string) => void;
  lastDragOperation: DragOperation | null;
  setLastDragOperation: (operation: DragOperation) => void;
  draggingItem: any | null;
  setDraggingItem: (item: any) => void;
}

// Create context with defaults
const CalendarSyncContext = createContext<CalendarSyncContextType>({
  globalDate: null,
  setGlobalDate: () => {},
  registerCalendar: () => {},
  unregisterCalendar: () => {},
  lastDragOperation: null,
  setLastDragOperation: () => {},
  draggingItem: null,
  setDraggingItem: () => {}
});

export interface CalendarSyncProviderProps {
  children: ReactNode;
  initialDate?: Date;
}

export const CalendarSyncProvider: React.FC<CalendarSyncProviderProps> = ({ children, initialDate }) => {
  const [globalDate, setGlobalDateState] = useState<Date | null>(initialDate || new Date());
  const [callbacks, setCallbacks] = useState<CalendarCallbacks>({});
  const [lastDragOperation, setLastDragOperation] = useState<DragOperation | null>(null);
  const [draggingItem, setDraggingItem] = useState<any | null>(null);

  // Register a calendar to receive date change notifications
  const registerCalendar = (id: string, onDateChange: (date: Date) => void) => {
    setCallbacks(prev => ({ ...prev, [id]: onDateChange }));
  };

  // Unregister a calendar
  const unregisterCalendar = (id: string) => {
    setCallbacks(prev => {
      const newCallbacks = { ...prev };
      delete newCallbacks[id];
      return newCallbacks;
    });
  };

  // Set global date and notify all registered calendars
  const setGlobalDate = (date: Date) => {
    setGlobalDateState(date);
    
    // Notify all registered calendars about the date change
    Object.values(callbacks).forEach(callback => {
      try {
        callback(date);
      } catch (error) {
        console.error("Error notifying calendar about date change:", error);
      }
    });
  };

  return (
    <CalendarSyncContext.Provider value={{
      globalDate,
      setGlobalDate,
      registerCalendar,
      unregisterCalendar,
      lastDragOperation,
      setLastDragOperation,
      draggingItem,
      setDraggingItem
    }}>
      {children}
    </CalendarSyncContext.Provider>
  );
};

// Custom hook for using the calendar sync context
export const useCalendarSync = () => {
  const context = useContext(CalendarSyncContext);
  
  if (context === undefined) {
    throw new Error("useCalendarSync must be used within a CalendarSyncProvider");
  }
  
  return context;
};

export default CalendarSyncProvider;
