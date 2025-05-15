import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { useDragDrop } from './DragDropContext';
import { DragItem, DraggableItemType } from './ScheduleTypes';
import { toast } from '@/hooks/use-toast';
import { useCalendarSync } from '@/context/CalendarSyncContext';

interface DroppableAreaProps {
  id: string;
  acceptTypes: DraggableItemType[];
  onDrop?: (item: DragItem, event?: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  activeClassName?: string;
  children?: React.ReactNode;
  date?: Date;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({
  id,
  acceptTypes,
  onDrop,
  onDragEnter,
  onDragLeave,
  onClick,
  className,
  activeClassName = 'drop-area-active',
  children,
  date
}) => {
  const { isDragging, draggedItem, registerDropTarget, unregisterDropTarget, setDragOverTarget } = useDragDrop();
  const { draggingItem } = useCalendarSync();
  
  const [isActive, setIsActive] = useState(false);
  const [canAccept, setCanAccept] = useState(false);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const dragEnterCountRef = useRef<number>(0);
  
  // Register with context and check if we can accept the current drag item
  useEffect(() => {
    registerDropTarget(id, acceptTypes);
    
    // Check if we can accept the current dragged item
    if (isDragging && draggedItem) {
      setCanAccept(acceptTypes.includes(draggedItem.type));
    } else {
      setCanAccept(false);
    }
    
    return () => {
      unregisterDropTarget(id);
    };
  }, [id, acceptTypes, registerDropTarget, unregisterDropTarget, isDragging, draggedItem]);
  
  // Sync with global dragging state
  useEffect(() => {
    if (draggingItem) {
      setCanAccept(acceptTypes.includes(draggingItem.type as DraggableItemType));
    } else {
      setCanAccept(false);
    }
  }, [draggingItem, acceptTypes]);
  
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Increment counter to handle nested elements
    dragEnterCountRef.current += 1;
    
    // Check if we can accept this drag item
    if ((isDragging && draggedItem && acceptTypes.includes(draggedItem.type)) ||
        (draggingItem && acceptTypes.includes(draggingItem.type as DraggableItemType))) {
      
      setIsActive(true);
      setDragOverTarget(id);
      
      if (onDragEnter) {
        onDragEnter(event);
      }
      
      // Add visual feedback immediately
      if (event.currentTarget) {
        event.currentTarget.classList.add('drag-over');
        
        // Add pulsing effect for better feedback
        event.currentTarget.classList.add('drop-area-pulse');
      }
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Safely add the active class to the current target if it exists
    if (event.currentTarget && ((isDragging && draggedItem && acceptTypes.includes(draggedItem.type)) || 
        (draggingItem && acceptTypes.includes(draggingItem.type as DraggableItemType)))) {
      
      event.currentTarget.classList.add('drag-over');
      event.dataTransfer.dropEffect = 'move';
      
      // Keep pulsing effect active
      if (!event.currentTarget.classList.contains('drop-area-pulse')) {
        event.currentTarget.classList.add('drop-area-pulse');
      }
    }
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Decrement counter
    dragEnterCountRef.current -= 1;
    
    // Only remove classes and call handlers when we've left the outermost element
    if (dragEnterCountRef.current === 0) {
      // Safely remove the active class if the current target exists
      if (event.currentTarget) {
        event.currentTarget.classList.remove('drag-over');
        event.currentTarget.classList.remove('drop-area-pulse');
      }
      
      setIsActive(false);
      setDragOverTarget(null);
      
      if (onDragLeave) {
        onDragLeave(event);
      }
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Reset drag counter
    dragEnterCountRef.current = 0;
    setIsActive(false);
    
    // Safely remove classes
    if (event.currentTarget) {
      event.currentTarget.classList.remove('drag-over');
      event.currentTarget.classList.remove('drop-area-pulse');
    }
    
    try {
      // First try to get the data as JSON
      let itemData = event.dataTransfer.getData('application/json');
      let item: DragItem | null = null;
      
      if (itemData) {
        item = JSON.parse(itemData);
      } else if (draggedItem) {
        // Use the global draggedItem as fallback
        item = draggedItem;
      } else if (draggingItem) {
        // Use the calendar context item as fallback
        item = {
          id: draggingItem.id,
          type: draggingItem.type as DraggableItemType,
          data: draggingItem.data
        };
      }
      
      // Process the drop if we have a valid item
      if (item && acceptTypes.includes(item.type) && onDrop) {
        onDrop(item, event);
        
        // Add a highlight effect to indicate a successful drop
        if (dropAreaRef.current) {
          dropAreaRef.current.classList.add('drop-target-highlight');
          setTimeout(() => {
            if (dropAreaRef.current) {
              dropAreaRef.current.classList.remove('drop-target-highlight');
            }
          }, 800);
        }
      }
    } catch (error) {
      console.error("Error processing dropped item:", error);
      toast({
        title: "Error",
        description: "Could not process the dropped item.",
        variant: "destructive"
      });
    }
  };

  // Handle click separately for touch devices
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      ref={dropAreaRef}
      id={`droppable-${id}`}
      className={cn(
        'drop-area transition-colors',
        className,
        isActive && activeClassName,
        canAccept && isDragging && 'can-accept',
        !canAccept && isDragging && 'cannot-accept'
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      data-droppable-id={id}
      data-accept-types={acceptTypes.join(',')}
      data-date={date?.toISOString()}
    >
      <style>
        {`
        .drop-area {
          transition: all 0.2s ease-out;
        }
        .drop-area-active {
          outline: 2px dashed hsl(var(--primary));
          background-color: rgba(var(--primary), 0.1);
        }
        .can-accept {
          cursor: copy !important;
        }
        .cannot-accept {
          cursor: no-drop !important;
        }
        .drop-target-highlight {
          animation: highlight-pulse 0.8s ease-out;
          transform: scale(1.02);
          transition: transform 0.2s ease-out;
        }
        @keyframes highlight-pulse {
          0% { background-color: transparent; }
          50% { background-color: rgba(var(--primary), 0.2); }
          100% { background-color: transparent; }
        }
        .drag-over {
          outline: 2px dashed hsl(var(--primary));
          background-color: rgba(var(--primary), 0.1);
          transform: scale(1.02);
        }
        .drop-area-pulse {
          animation: pulse-border 1.5s infinite;
        }
        @keyframes pulse-border {
          0% { outline-color: hsla(var(--primary), 0.7); }
          50% { outline-color: hsla(var(--primary), 1); }
          100% { outline-color: hsla(var(--primary), 0.7); }
        }
        `}
      </style>
      {children}
    </div>
  );
};

export default DroppableArea;
