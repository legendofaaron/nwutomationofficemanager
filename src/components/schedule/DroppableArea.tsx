
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDragDrop } from './DragDropContext';
import { DragItem, DraggableItemType } from './ScheduleTypes';
import { toast } from '@/hooks/use-toast';

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
  children
}) => {
  const { isDragging, draggedItem, registerDropTarget, unregisterDropTarget } = useDragDrop();
  const [isActive, setIsActive] = useState(false);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const dragEnterCountRef = useRef<number>(0);
  
  useEffect(() => {
    registerDropTarget(id, acceptTypes);
    return () => {
      unregisterDropTarget(id);
    };
  }, [id, acceptTypes, registerDropTarget, unregisterDropTarget]);
  
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Increment counter to handle nested elements
    dragEnterCountRef.current += 1;
    
    if (isDragging && draggedItem && acceptTypes.includes(draggedItem.type)) {
      setIsActive(true);
      if (onDragEnter) {
        onDragEnter(event);
      }
      
      // Add visual feedback immediately
      if (event.currentTarget) {
        event.currentTarget.classList.add('drag-over');
      }
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Safely add the active class to the current target if it exists
    if (event.currentTarget && isDragging && draggedItem && acceptTypes.includes(draggedItem.type)) {
      event.currentTarget.classList.add('drag-over');
      event.dataTransfer.dropEffect = 'move';
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
      }
      
      setIsActive(false);
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
    
    // Safely remove the drag-over class if the current target exists
    if (event.currentTarget) {
      event.currentTarget.classList.remove('drag-over');
    }
    
    try {
      // First try to get the data as JSON
      let itemData = event.dataTransfer.getData('application/json');
      let item: DragItem | null = null;
      
      if (itemData) {
        item = JSON.parse(itemData);
      } else {
        // Fallback for browsers or cases where JSON data isn't available
        const id = event.dataTransfer.getData('text/plain');
        if (id && draggedItem && draggedItem.id === id) {
          item = draggedItem;
        }
      }
      
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

  return (
    <div
      ref={dropAreaRef}
      id={`droppable-${id}`}
      className={cn(
        'drop-area transition-colors',
        className,
        isActive && activeClassName
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
      data-droppable-id={id}
      data-accept-types={acceptTypes.join(',')}
    >
      <style>
        {`
        .drop-area-active {
          outline: 2px dashed hsl(var(--primary));
          background-color: rgba(var(--primary), 0.1);
        }
        .drop-target-highlight {
          animation: highlight-pulse 0.8s ease;
        }
        @keyframes highlight-pulse {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(var(--primary), 0.2); }
        }
        .drag-over {
          outline: 2px dashed hsl(var(--primary));
          background-color: rgba(var(--primary), 0.1);
        }
        `}
      </style>
      {children}
    </div>
  );
};

export default DroppableArea;
