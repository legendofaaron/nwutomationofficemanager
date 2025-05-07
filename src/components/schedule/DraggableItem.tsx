
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDragDrop } from './DragDropContext';
import { DragItem, DraggableItemType } from './ScheduleTypes';

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
  const [isDraggingThis, setIsDraggingThis] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Check if this item is being dragged
  useEffect(() => {
    const isThisBeingDragged = isDragging && draggedItem?.id === id && draggedItem?.type === type;
    setIsDraggingThis(isThisBeingDragged);
  }, [isDragging, draggedItem, id, type]);
  
  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
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
    
    // Set data transfer
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    
    // Create a custom drag image with preview of content
    try {
      const dragImage = document.createElement('div');
      dragImage.className = 'task-drag-preview';
      
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
      }
      
      dragImage.innerHTML = `<div class="${bgColor} text-white px-2 py-1 rounded shadow text-xs flex items-center">
        <span class="mr-1.5">${emoji}</span>
        <span class="max-w-[150px] truncate">${data.title || data.name || type}</span>
      </div>`;
      
      document.body.appendChild(dragImage);
      
      // Position the drag image relative to the mouse
      e.dataTransfer.setDragImage(dragImage, 15, 15);
      
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
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
    
    // Trigger global drag start
    startDrag({
      item,
      node: itemRef.current!,
      clientX: e.clientX,
      clientY: e.clientY
    });
    
    // Call custom handler
    if (onDragStart) {
      onDragStart(item);
    }
  };
  
  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
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
    
    // Call custom handler
    if (onDragEnd) {
      onDragEnd(dropped);
    }
  };
  
  return (
    <div
      ref={itemRef}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        'transition-all duration-200 cursor-grab',
        className,
        isDraggingThis && dragActiveClassName
      )}
      data-draggable-id={id}
      data-draggable-type={type}
    >
      <style jsx global>{`
        .dragging-active {
          opacity: 0.6;
          transform: scale(0.98);
        }
        .drop-highlight {
          animation: highlight-pulse 0.5s ease-in-out;
        }
        @keyframes highlight-pulse {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(var(--primary), 0.2); }
        }
      `}</style>
      {children}
    </div>
  );
};

export default DraggableItem;
