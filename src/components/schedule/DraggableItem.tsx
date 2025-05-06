
import React, { useRef, useState } from 'react';
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
  const isThisBeingDragged = isDragging && draggedItem?.id === id && draggedItem?.type === type;
  
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
    
    // Set cursor style
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Invisible drag image
    
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
        isThisBeingDragged && dragActiveClassName
      )}
      data-draggable-id={id}
      data-draggable-type={type}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
