
import { useState, useEffect } from 'react';
import { useDragDrop } from './DragDropContext';
import { DraggableItemType, DragItem } from './ScheduleTypes';

interface UseDraggableOptions {
  id: string;
  type: DraggableItemType;
  data: any;
  onDragStart?: (item: DragItem) => void;
  onDragEnd?: (dropped: boolean, dropTargetId?: string) => void;
  disabled?: boolean;
  containerId?: string;
}

interface UseDroppableOptions {
  id: string;
  acceptTypes: DraggableItemType[];
  onDrop: (item: DragItem, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

// Hook for draggable items
export function useDraggable({
  id,
  type,
  data,
  onDragStart,
  onDragEnd,
  disabled = false,
  containerId
}: UseDraggableOptions) {
  const { startDrag, endDrag, isDragging, draggedItem } = useDragDrop();
  const [isDraggingThis, setIsDraggingThis] = useState(false);
  
  // Check if this item is being dragged
  useEffect(() => {
    const isThisBeingDragged = isDragging && draggedItem?.id === id && draggedItem?.type === type;
    setIsDraggingThis(isThisBeingDragged);
  }, [isDragging, draggedItem, id, type]);
  
  // Create handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    e.stopPropagation();
    
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
    
    // Set cursor style - using a transparent image allows us to style the drag element
    const dragImage = new Image();
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent 1px image
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Set state
    setIsDraggingThis(true);
    
    // Trigger global drag start
    startDrag({
      item,
      node: e.currentTarget,
      clientX: e.clientX,
      clientY: e.clientY
    });
    
    // Call custom handler
    if (onDragStart) {
      onDragStart(item);
    }
  };
  
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
  
  return {
    isDragging: isDraggingThis,
    dragProps: {
      draggable: !disabled,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      'data-draggable-id': id,
      'data-draggable-type': type
    }
  };
}

// Hook for droppable areas
export function useDroppable({
  id,
  acceptTypes,
  onDrop,
  onDragEnter,
  onDragLeave,
  disabled = false
}: UseDroppableOptions) {
  const [isOver, setIsOver] = useState(false);
  const [canAcceptCurrent, setCanAcceptCurrent] = useState(false);
  const { isDragging, draggedItem, registerDropTarget, unregisterDropTarget, setDragOverTarget } = useDragDrop();
  const dragEnterCountRef = useState(0);
  
  // Register this drop area with the context
  useEffect(() => {
    if (!disabled) {
      registerDropTarget(id, acceptTypes);
    }
    
    return () => {
      unregisterDropTarget(id);
    };
  }, [id, acceptTypes.join(','), disabled, registerDropTarget, unregisterDropTarget]);
  
  // Check if this area can accept the currently dragged item
  useEffect(() => {
    if (isDragging && draggedItem) {
      setCanAcceptCurrent(acceptTypes.includes(draggedItem.type));
    } else {
      setCanAcceptCurrent(false);
    }
  }, [isDragging, draggedItem, acceptTypes]);
  
  // Create handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragEnterCountRef[0]++;
    
    if (dragEnterCountRef[0] === 1) {
      setDragOverTarget(id);
      setIsOver(true);
      
      // Add visual feedback for the drop target
      e.currentTarget.classList.add('drag-over-active');
      
      // Call custom handler
      if (onDragEnter) {
        onDragEnter(e);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set drop effect
    if (!disabled && canAcceptCurrent) {
      e.dataTransfer.dropEffect = 'move';
      // Optional: add a CSS class to highlight the drop target
      e.currentTarget.classList.add('drag-over-active');
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragEnterCountRef[0]--;
    
    if (dragEnterCountRef[0] === 0) {
      setDragOverTarget(null);
      setIsOver(false);
      
      // Remove visual feedback
      e.currentTarget.classList.remove('drag-over-active');
      
      // Call custom handler
      if (onDragLeave) {
        onDragLeave(e);
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset state
    dragEnterCountRef[0] = 0;
    setIsOver(false);
    setDragOverTarget(null);
    
    // Remove visual feedback
    e.currentTarget.classList.remove('drag-over-active');
    
    // Add visual feedback for the drop
    const element = e.currentTarget;
    element.classList.add('drop-highlight');
    setTimeout(() => {
      element.classList.remove('drop-highlight');
    }, 500);
    
    // Handle drop
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const item: DragItem = JSON.parse(data);
        if (acceptTypes.includes(item.type) && !disabled) {
          onDrop(item, e);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  return {
    isOver,
    canAcceptCurrent,
    dropProps: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      'data-droppable-id': id,
      'data-droppable-accepts': acceptTypes.join(',')
    }
  };
}
