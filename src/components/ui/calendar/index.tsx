
import React, { useEffect, useRef } from 'react';
import { DayPicker, useDayPicker } from 'react-day-picker';
import { SelectSingleEventHandler } from 'react-day-picker';
import { resolveProps } from './utils';
import { CalendarProps } from './types';
import { CustomCaption } from './CustomCaption';
import { useAppContext } from '@/context/AppContext';

export const Calendar = ({
  ...props
}: CalendarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { globalCalendarSync, setGlobalCalendarSync } = useAppContext();
  
  // Extract props from react-day-picker  
  const { classNames, components, styles } = resolveProps(props);
  
  // Forward selected date changes to global state
  useEffect(() => {
    if (props.onSelect && globalCalendarSync.source !== props.id && globalCalendarSync.date) {
      const handler = props.onSelect as SelectSingleEventHandler;
      
      if (props.id) {
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
          view: window as unknown as Window, // Cast to the expected Window type
          which: 1
        } as unknown as React.MouseEvent<Element, MouseEvent>;
        
        // Create modifiers object in the correct format
        const calendarDate = globalCalendarSync.date;
        const modifiers = {};
        const activeModifiers = { selected: true };
        if (calendarDate.toDateString() === new Date().toDateString()) {
          activeModifiers['today'] = true;
        }
        
        // Call handler with the date object as first parameter, modifiers as second parameter
        handler(calendarDate, modifiers, activeModifiers, dummyEvent);
      }
    }
  }, [globalCalendarSync, props]);

  const handleSelect: SelectSingleEventHandler = (date, modifiers, dayPickerProps, e) => {
    if (props.onSelect && date) {
      props.onSelect(date, modifiers, dayPickerProps, e);
      
      // Synchronize with global state
      if (props.id && date) {
        setGlobalCalendarSync({
          date: date as Date,
          source: props.id
        });
      }
    }
  };

  return (
    <div ref={ref} className="calendar-component" data-calendar={props.id || 'default'}>
      <DayPicker
        {...props}
        onSelect={handleSelect}
        classNames={classNames}
        components={{
          ...components,
          Caption: props.customCaption ? CustomCaption : components?.Caption
        }}
        styles={styles}
      />
    </div>
  );
};
