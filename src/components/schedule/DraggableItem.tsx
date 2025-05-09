
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
      dragImage.innerHTML = `<div class="bg-primary text-white px-2 py-1 rounded shadow text-xs">${data.title || 'Task'}</div>`;
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 10, 10);
      
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    } catch (error) {
      // If custom drag image fails, fall back to default
      console.warn('Failed to set custom drag image:', error);
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
        'transition-all duration-200',
        className,
        isDraggingThis && dragActiveClassName
      )}
      data-draggable-id={id}
      data-draggable-type={type}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
