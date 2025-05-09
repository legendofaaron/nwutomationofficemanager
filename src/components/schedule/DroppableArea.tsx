
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
  
  // Reset drag enter count when drag session ends
  useEffect(() => {
    if (!isDragging) {
      dragEnterCount.current = 0;
      setIsOver(false);
    }
  }, [isDragging]);
  
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
  
  // Handle drag over with improved detection
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set drop effect
    if (!disabled && canAcceptCurrent) {
      e.dataTransfer.dropEffect = 'move';
      
      // Ensure visual feedback stays consistent
      if (elementRef.current && !elementRef.current.classList.contains('drag-over-active')) {
        elementRef.current.classList.add('drag-over-active');
        setIsOver(true);
        setDragOverTarget(id);
      }
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };
  
  // Handle drag leave with improved counter
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragEnterCount.current--;
    
    // Add a timeout to prevent flickering between child elements
    setTimeout(() => {
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
    }, 50);
  };
  
  // Handle drop with improved parsing
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
    
    // Handle drop with multiple fallbacks
    try {
      let itemData: DragItem | null = null;
      
      // Try primary format
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        try {
          itemData = JSON.parse(jsonData);
        } catch (error) {
          console.warn('Failed to parse application/json data:', error);
        }
      }
      
      // Try fallback format if primary failed
      if (!itemData) {
        const textData = e.dataTransfer.getData('text/plain');
        if (textData) {
          try {
            itemData = JSON.parse(textData);
          } catch (error) {
            console.warn('Failed to parse text/plain data:', error);
          }
        }
      }
      
      // Process the drop if we have valid data
      if (itemData && acceptTypes.includes(itemData.type) && !disabled) {
        onDrop(itemData, e);
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
      <style>
        {`
        .drag-over-active {
          border: 2px dashed var(--primary);
          background-color: rgba(var(--primary), 0.1);
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
    </div>
  );
};

export default DroppableArea;
