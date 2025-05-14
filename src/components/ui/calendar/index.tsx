import React, { useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import { SelectSingleEventHandler, SelectRangeEventHandler, SelectMultipleEventHandler } from 'react-day-picker';
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
        
        // Only call the handler if we have a valid Date object
        const calendarDate = globalCalendarSync.date;
        
        // Fix for error: Empty object {} is not assignable to type 'Date'
        if (calendarDate instanceof Date) {
          const singleSelectHandler = props.onSelect as SelectSingleEventHandler;
          // Create proper DayPickerProps with the selected date
          const dayPickerProps = { selected: calendarDate };
          // Pass empty modifiers object and properly typed dayPickerProps
          const emptyModifiers = {}; // Create empty object for modifiers
          singleSelectHandler(calendarDate, emptyModifiers, dayPickerProps as any, dummyEvent);
        }
      }
    }
  }, [globalCalendarSync, props, id, mode]);

  const handleSelect = (value: Date | Date[] | import('react-day-picker').DateRange | undefined, 
                        modifiers: any, dayPickerProps: any, e?: React.MouseEvent) => {
    if (!props.onSelect) return;
    
    // Type-safe handling based on mode
    if (mode === 'single' && value instanceof Date) {
      const singleSelectHandler = props.onSelect as SelectSingleEventHandler;
      singleSelectHandler(value, modifiers, dayPickerProps, e);
      
      // Synchronize with global state
      if (id && value) {
        setGlobalCalendarSync({
          date: value,
          source: id
        });
      }
    } else if (mode === 'multiple' && Array.isArray(value)) {
      const multipleSelectHandler = props.onSelect as SelectMultipleEventHandler;
      multipleSelectHandler(value, modifiers, dayPickerProps, e);
    } else if (mode === 'range' && value && 'from' in value) {
      const rangeSelectHandler = props.onSelect as SelectRangeEventHandler;
      rangeSelectHandler(value, modifiers, dayPickerProps, e);
    }
  };

  // Create type-safe props for each specific mode
  const renderCalendar = () => {
    // Base props common to all modes
    const baseProps = {
      classNames,
      styles,
      components: {
        ...components,
        Caption: customCaption ? CustomCaption : components?.Caption
      }
    };

    // Render the appropriate DayPicker based on mode
    switch (mode) {
      case 'single':
        return (
          <DayPicker
            {...props}
            {...baseProps}
            mode="single"
            selected={props.selected as Date}
            onSelect={(day, modifiers, props, e) => 
              handleSelect(day, modifiers, props, e)
            }
          />
        );
      case 'multiple':
        return (
          <DayPicker
            {...props}
            {...baseProps}
            mode="multiple"
            selected={props.selected as Date[]}
            onSelect={(days, modifiers, props, e) => 
              handleSelect(days, modifiers, props, e)
            }
          />
        );
      case 'range':
        return (
          <DayPicker
            {...props}
            {...baseProps}
            mode="range"
            selected={props.selected as import('react-day-picker').DateRange}
            onSelect={(range, modifiers, props, e) => 
              handleSelect(range, modifiers, props, e)
            }
          />
        );
      default:
        return (
          <DayPicker
            {...props}
            {...baseProps}
            mode="single"
            selected={props.selected as Date}
            onSelect={(day, modifiers, props, e) => 
              handleSelect(day, modifiers, props, e)
            }
          />
        );
    }
  };

  return (
    <div ref={ref} className="calendar-component" data-calendar={id || 'default'}>
      {renderCalendar()}
    </div>
  );
};
