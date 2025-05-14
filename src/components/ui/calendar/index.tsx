
import React, { useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import { SelectSingleEventHandler, SelectRangeEventHandler, SelectMultipleEventHandler } from 'react-day-picker';
import { CustomCaption } from './CustomCaption';
import type { CalendarProps } from './types';
import { getCrewLetterCode } from './utils';

// Create a dummy synthetic event object for the day picker
const dummyEvent = {
  target: {} as Element,
  type: 'click',
  nativeEvent: {} as MouseEvent,
  preventDefault: () => {},
  stopPropagation: () => {},
  isDefaultPrevented: () => false,
  isPropagationStopped: () => false,
  persist: () => {},
  currentTarget: {} as EventTarget & Element,
  bubbles: false,
  cancelable: false,
  eventPhase: 0,
  isTrusted: false,
  timeStamp: Date.now(),
  defaultPrevented: false,
  returnValue: true
};

export function Calendar(props: CalendarProps) {
  const { 
    crew,
    date, 
    onDateChange,
    isRange = false,
    isMultiple = false,
    monthFormat = 'MMM yyyy', 
    ...otherProps 
  } = props;
  
  const calendarDate = date || new Date();
  const dateRef = useRef<Date>(calendarDate instanceof Date ? calendarDate : new Date());
  
  useEffect(() => {
    if (date && date instanceof Date) {
      dateRef.current = date;
    }
  }, [date]);
  
  // Update month when crew changes to ensure proper navigation
  useEffect(() => {
    if (crew && crew.startDate) {
      const crewStartDate = new Date(crew.startDate);
      if (crewStartDate && !isNaN(crewStartDate.getTime())) {
        dateRef.current = crewStartDate;
        if (onDateChange) {
          onDateChange(crewStartDate);
        }
      }
    }
  }, [crew, onDateChange]);
  
  const CustomFooter = () => {
    return (
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {crew && <span>Crew: {getCrewLetterCode(crew.name)}</span>}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  };

  const handleOnSelect = (newDate: Date | Date[] | undefined) => {
    if (!onDateChange || !newDate) return;
    
    // Determine the type of selection based on the shape of the data
    if (Array.isArray(newDate)) {
      if (isRange) {
        // Range selection (start and end date)
        const rangeHandler = props.onSelect as SelectRangeEventHandler;
        if (rangeHandler && newDate.length === 2) {
          const range = { from: newDate[0], to: newDate[1] };
          rangeHandler(range, { selected: [] }, { selected: range }, dummyEvent);
        }
      } else if (isMultiple) {
        // Multiple date selection
        const multiHandler = props.onSelect as SelectMultipleEventHandler;
        if (multiHandler) {
          multiHandler(newDate, { selected: [] }, { selected: newDate }, dummyEvent);
        }
      }
    } else if (newDate instanceof Date) {
      // Single date selection - immediately call onDateChange to update UI
      if (onDateChange) {
        onDateChange(newDate);
      }
      
      // Also call the original onSelect handler if provided
      if (props.onSelect) {
        const singleSelectHandler = props.onSelect as SelectSingleEventHandler;
        const selectedModifiers = { selected: [newDate] };
        singleSelectHandler(newDate, selectedModifiers, { selected: newDate }, dummyEvent);
      }
    }
  }

  // Determine the actual mode to use based on the isRange and isMultiple props
  const actualMode = isRange ? "range" : isMultiple ? "multiple" : "single";

  return (
    <DayPicker
      className="p-3 pointer-events-auto" 
      mode={actualMode}
      selected={date}
      onSelect={handleOnSelect}
      components={{
        Caption: (captionProps) => (
          <CustomCaption 
            {...captionProps} 
            monthFormat={monthFormat} 
          />
        ),
        Footer: CustomFooter
      }}
      {...otherProps}
    />
  );
}
