
import React, { useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import { SelectSingleEventHandler } from 'react-day-picker';
import { resolveProps } from './utils';
import { CalendarProps } from './types';
import { CustomCaption } from './CustomCaption';
import { useAppContext } from '@/context/AppContext';

export const Calendar = ({
  mode = 'single',
  id,
  customCaption = false,
  ...props
}: CalendarProps & { id?: string, customCaption?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { globalCalendarSync, setGlobalCalendarSync } = useAppContext();
  
  // Extract props from react-day-picker  
  const { classNames, components, styles } = resolveProps(props);
  
  // Forward selected date changes to global state
  useEffect(() => {
    if (props.onSelect && globalCalendarSync.source !== id && globalCalendarSync.date) {
      const handler = props.onSelect as SelectSingleEventHandler;
      
      if (id && mode === 'single') {
        // Create a proper event object
        const dummyEvent = {
          target: ref.current as HTMLDivElement,
          currentTarget: ref.current as HTMLDivElement,
          bubbles: false,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: true,
          preventDefault: () => {},
          isDefaultPrevented: () => false,
          stopPropagation: () => {},
          isPropagationStopped: () => false,
          stopImmediatePropagation: () => {},
          persist: () => {},
          timeStamp: Date.now(),
          type: 'click',
          nativeEvent: {} as MouseEvent,
          altKey: false,
          button: 0,
          buttons: 0,
          clientX: 0,
          clientY: 0,
          ctrlKey: false,
          metaKey: false,
          movementX: 0,
          movementY: 0,
          pageX: 0,
          pageY: 0,
          relatedTarget: null,
          screenX: 0,
          screenY: 0,
          shiftKey: false,
          detail: 0,
          view: window as unknown as Window,
          which: 1
        } as unknown as React.MouseEvent<Element, MouseEvent>;
        
        // Pass the date as first arg, empty objects for the modifiers
        const calendarDate = globalCalendarSync.date;
        
        // Fix for error: Empty object {} is not assignable to type 'Date'
        // Only call the handler if we have a valid Date object
        if (calendarDate instanceof Date) {
          handler(calendarDate, {}, { selected: true }, dummyEvent);
        }
      }
    }
  }, [globalCalendarSync, props, id, mode]);

  const handleSelect: SelectSingleEventHandler = (date, modifiers, dayPickerProps, e) => {
    if (props.onSelect && date && mode === 'single') {
      const singleSelectHandler = props.onSelect as SelectSingleEventHandler;
      singleSelectHandler(date, modifiers, dayPickerProps, e);
      
      // Synchronize with global state
      if (id && date) {
        setGlobalCalendarSync({
          date: date,
          source: id
        });
      }
    }
  };

  // Create a type-safe version of the props based on the mode
  const createDayPickerProps = () => {
    // Base props that all modes share
    const baseProps = {
      ...props,
      onSelect: handleSelect,
      classNames,
      styles,
      components: {
        ...components,
        Caption: customCaption ? CustomCaption : components?.Caption
      }
    };

    // Return specific props based on the current mode
    if (mode === 'single') {
      return {
        ...baseProps,
        mode: 'single' as const
      };
    } else if (mode === 'multiple') {
      return {
        ...baseProps,
        mode: 'multiple' as const
      };
    } else if (mode === 'range') {
      return {
        ...baseProps,
        mode: 'range' as const
      };
    }

    // Default to single mode
    return {
      ...baseProps,
      mode: 'single' as const
    };
  };

  // Get the correct props for the current mode
  const dayPickerProps = createDayPickerProps();

  return (
    <div ref={ref} className="calendar-component" data-calendar={id || 'default'}>
      <DayPicker {...dayPickerProps} />
    </div>
  );
};
