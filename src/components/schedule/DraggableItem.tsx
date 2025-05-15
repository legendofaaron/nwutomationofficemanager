
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useDragDrop } from './DragDropContext';
import { DragItem, DraggableItemType } from './ScheduleTypes';
import { useCalendarSync } from '@/context/CalendarSyncContext';

interface DraggableItemProps {
  id: string;
  type: DraggableItemType;
  data: any;
  disabled?: boolean;
  onDragStart?: (item: DragItem) => void;
  onDragEnd?: (dropped: boolean, dropTargetId?: string) => void;
  dragHandleSelector?: string;
  className?: string;
  dragActiveClassName?: string;
  children: React.ReactNode;
  containerId?: string;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  type,
  data,
  disabled = false,
  onDragStart,
  onDragEnd,
  dragHandleSelector,
  className,
  dragActiveClassName = 'dragging opacity-50',
  children,
  containerId
}) => {
  const { startDrag, endDrag, isDragging, draggedItem } = useDragDrop();
  const { setDraggingItem } = useCalendarSync();
  const [isDraggingThis, setIsDraggingThis] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const dragStartTimeRef = useRef<number>(0);
  const dragImageRef = useRef<HTMLDivElement | null>(null);
  const touchTimeoutRef = useRef<number | null>(null);
  
  // Create drag image element on mount
  useEffect(() => {
    const dragImage = document.createElement('div');
    dragImage.className = `${type}-drag-preview`;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    
    dragImageRef.current = dragImage;
    
    return () => {
      if (dragImage && document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    };
  }, [type]);
  
  // Check if this item is being dragged
  useEffect(() => {
    const isThisBeingDragged = isDragging && draggedItem?.id === id && draggedItem?.type === type;
    setIsDraggingThis(isThisBeingDragged);
    
    // Add dragging class for visual consistency
    if (itemRef.current) {
      if (isThisBeingDragged) {
        itemRef.current.classList.add('dragging-active');
      } else {
        itemRef.current.classList.remove('dragging-active');
      }
    }
  }, [isDragging, draggedItem, id, type]);
  
  // Handle drag start with improved reliability
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    // Prevent duplicate drag events within a short timeframe
    const now = Date.now();
    if (now - dragStartTimeRef.current < 500) {
      e.preventDefault();
      return;
    }
    
    dragStartTimeRef.current = now;
    
    e.stopPropagation();
    
    // If using drag handles, check if handle was clicked
    if (dragHandleSelector) {
      const target = e.target as HTMLElement;
      const closest = target.closest(dragHandleSelector);
      if (!closest) {
        e.preventDefault();
        return;
      }
    }
    
    // Create item data - ensure all necessary properties are included
    const item: DragItem = {
      id,
      type,
      sourceContainerId: containerId,
      data: {
        ...data,
        id,
        type
      }
    };
    
    // Set data transfer with improved reliability
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id); // Set a simple ID as fallback
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    
    // Create a custom drag image with preview of content
    try {
      if (dragImageRef.current) {
        // Different visual styles based on item type for better UX
        let emoji = '📋';
        let bgColor = 'bg-primary';
        
        if (type === 'employee') {
          emoji = '👤';
          bgColor = 'bg-blue-500';
        } else if (type === 'crew') {
          emoji = '👥';
          bgColor = 'bg-green-500';
        } else if (type === 'client') {
          emoji = '🏢';
          bgColor = 'bg-amber-500';
        } else if (type === 'invoice') {
          emoji = '📄';
          bgColor = 'bg-violet-500';
        } else if (type === 'booking') {
          emoji = '🗓️';
          bgColor = 'bg-teal-500';
        }
        
        dragImageRef.current.innerHTML = `<div class="${bgColor} text-white px-3 py-2 rounded-md shadow-lg text-sm flex items-center gap-2">
          <span>${emoji}</span>
          <span class="max-w-[150px] truncate font-medium">${data.title || data.name || type}</span>
        </div>`;
        
        e.dataTransfer.setDragImage(dragImageRef.current, 25, 25);
      }
    } catch (error) {
      // If custom drag image fails, fall back to default
      console.warn('Failed to set custom drag image:', error);
    }
    
    // Set visual feedback
    if (itemRef.current) {
      itemRef.current.classList.add('dragging-active');
    }
    
    // Set state
    setIsDraggingThis(true);
    
    // Update global dragging state
    setDraggingItem({
      type,
      id,
      data: {
        ...data,
        id,
        type
      }
    });
    
    // Trigger global drag start with all necessary data
    startDrag({
      item,
      node: itemRef.current!,
      clientX: e.clientX,
      clientY: e.clientY,
      customDragImage: true
    });
    
    // Call custom handler
    if (onDragStart) {
      onDragStart(item);
    }
  }, [disabled, id, type, containerId, data, startDrag, onDragStart, setDraggingItem]);
  
  // Handle drag end with improved cleanup
  const handleDragEnd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    // Reset state
    setIsDraggingThis(false);
    
    // Remove visual feedback
    if (itemRef.current) {
      itemRef.current.classList.remove('dragging-active');
    }
    
    // Trigger global drag end
    const dropped = e.dataTransfer.dropEffect !== 'none';
    endDrag(dropped);
    
    // Clear global dragging state
    setDraggingItem(null);
    
    // Call custom handler
    if (onDragEnd) {
      onDragEnd(dropped);
    }
    
    // Reset drag start time
    dragStartTimeRef.current = 0;
  }, [endDrag, onDragEnd, setDraggingItem]);
  
  // Handle touch events for mobile drag and drop
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    // Clear any existing timeout
    if (touchTimeoutRef.current !== null) {
      window.clearTimeout(touchTimeoutRef.current);
    }
    
    // Set timeout to detect long press
    touchTimeoutRef.current = window.setTimeout(() => {
      const touch = e.touches[0];
      if (!touch) return;
      
      // Create item data
      const item: DragItem = {
        id,
        type,
        sourceContainerId: containerId,
        data: {
          ...data,
          id,
          type
        }
      };
      
      // Set visual feedback
      if (itemRef.current) {
        itemRef.current.classList.add('touch-dragging');
      }
      
      // Set state
      setIsDraggingThis(true);
      
      // Update global dragging state
      setDraggingItem({
        type,
        id,
        data: {
          ...data,
          id,
          type
        }
      });
      
      // Trigger global drag start
      startDrag({
        item,
        node: itemRef.current!,
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      
      // Call custom handler
      if (onDragStart) {
        onDragStart(item);
      }
      
      // Provide haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms is a good duration for long press
  }, [disabled, id, type, containerId, data, startDrag, onDragStart, setDraggingItem]);
  
  const handleTouchEnd = useCallback(() => {
    // Clear the timeout
    if (touchTimeoutRef.current !== null) {
      window.clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    
    // If we were dragging, end the drag
    if (isDraggingThis) {
      // Remove visual feedback
      if (itemRef.current) {
        itemRef.current.classList.remove('touch-dragging');
      }
      
      // Reset state
      setIsDraggingThis(false);
      
      // Trigger global drag end
      endDrag(false);
      
      // Clear global dragging state
      setDraggingItem(null);
      
      // Call custom handler
      if (onDragEnd) {
        onDragEnd(false);
      }
    }
  }, [isDraggingThis, endDrag, onDragEnd, setDraggingItem]);
  
  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current !== null) {
        window.clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div
      ref={itemRef}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={cn(
        'transition-all duration-200 cursor-grab',
        className,
        isDraggingThis && dragActiveClassName
      )}
      data-draggable-id={id}
      data-draggable-type={type}
    >
      <style>
        {`
        .dragging-active {
          opacity: 0.6;
          transform: scale(0.98);
          box-shadow: 0 0 0 2px rgba(var(--primary), 0.3);
          outline: 1px dashed rgba(var(--primary), 0.5);
        }
        .touch-dragging {
          opacity: 0.7;
          transform: scale(0.98);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .drop-highlight {
          animation: highlight-pulse 0.5s ease-in-out;
        }
        @keyframes highlight-pulse {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(var(--primary), 0.2); }
        }
        `}
      </style>
      {children}
    </div>
  );
};

export default DraggableItem;
