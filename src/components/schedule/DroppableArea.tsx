
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useDragDrop } from './DragDropContext';
import { DroppableConfig, DraggableItemType, DragItem } from './ScheduleTypes';

interface DroppableAreaProps {
  id: string;
  acceptTypes: DraggableItemType[];
  onDrop: (item: DragItem, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  className?: string;
  activeClassName?: string;
  acceptClassName?: string;
  rejectClassName?: string;
  disabled?: boolean;
  children: React.ReactNode;
  'data-date'?: string;
}

export const DroppableArea: React.FC<DroppableAreaProps> = ({
  id,
  acceptTypes,
  onDrop,
  onDragEnter,
  onDragLeave,
  className,
  activeClassName = 'drag-over border-dashed border-2 border-primary bg-primary/10',
  acceptClassName = 'valid-drop-target',
  rejectClassName = 'invalid-drop-target',
  disabled = false,
  children,
  ...rest
}) => {
  const [isOver, setIsOver] = useState(false);
  const [canAcceptCurrent, setCanAcceptCurrent] = useState(false);
  const { isDragging, draggedItem, registerDropTarget, unregisterDropTarget, setDragOverTarget } = useDragDrop();
  const dragEnterCount = useRef(0);
  const elementRef = useRef<HTMLDivElement>(null);
  
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
  
  // Handle drag enter
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragEnterCount.current++;
    
    if (dragEnterCount.current === 1) {
      setDragOverTarget(id);
      setIsOver(true);
      
      // Add visual feedback
      if (elementRef.current) {
        elementRef.current.classList.add('drag-over-active');
      }
      
      // Call custom handler
      if (onDragEnter) {
        onDragEnter(e);
      }
    }
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set drop effect
    if (!disabled && canAcceptCurrent) {
      e.dataTransfer.dropEffect = 'move';
      
      // Ensure visual feedback stays consistent
      if (elementRef.current && !elementRef.current.classList.contains('drag-over-active')) {
        elementRef.current.classList.add('drag-over-active');
      }
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };
  
  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragEnterCount.current--;
    
    if (dragEnterCount.current === 0) {
      setDragOverTarget(null);
      setIsOver(false);
      
      // Remove visual feedback
      if (elementRef.current) {
        elementRef.current.classList.remove('drag-over-active');
      }
      
      // Call custom handler
      if (onDragLeave) {
        onDragLeave(e);
      }
    }
  };
  
  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset state
    dragEnterCount.current = 0;
    setIsOver(false);
    setDragOverTarget(null);
    
    // Remove visual feedback
    if (elementRef.current) {
      elementRef.current.classList.remove('drag-over-active');
    }
    
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
  
  return (
    <div
      ref={elementRef}
      id={`droppable-${id}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'transition-all duration-200',
        className,
        isDragging && canAcceptCurrent && !disabled && acceptClassName,
        isDragging && !canAcceptCurrent && !disabled && rejectClassName,
        isOver && !disabled && activeClassName
      )}
      data-droppable-id={id}
      data-droppable-accepts={acceptTypes.join(',')}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
