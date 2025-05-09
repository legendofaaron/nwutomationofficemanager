import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDragDrop } from './DragDropContext';
import { DragItem, DraggableItemType } from './ScheduleTypes';

interface DroppableAreaProps {
  id: string;
  acceptTypes: DraggableItemType[];
  onDrop?: (item: DragItem, event: React.DragEvent<HTMLDivElement>) => void;
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
  activeClassName,
  children
}) => {
  const { isDragging, draggedItem, registerDropTarget, unregisterDropTarget } = useDragDrop();
  const [isActive, setIsActive] = useState(false);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    registerDropTarget(id, acceptTypes);
    return () => {
      unregisterDropTarget(id);
    };
  }, [id, acceptTypes, registerDropTarget, unregisterDropTarget]);
  
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isDragging && draggedItem && acceptTypes.includes(draggedItem.type)) {
      setIsActive(true);
      if (onDragEnter) {
        onDragEnter(event);
      }
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsActive(false);
    if (onDragLeave) {
      onDragLeave(event);
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsActive(false);
    
    try {
      const itemData = event.dataTransfer.getData('application/json');
      if (itemData) {
        const item: DragItem = JSON.parse(itemData);
        if (acceptTypes.includes(item.type) && onDrop) {
          onDrop(item, event);
        }
      }
    } catch (error) {
      console.error("Error processing dropped item:", error);
    }
  };

  // Fix the style tag
  return (
    <div
      ref={dropAreaRef}
      id={`droppable-${id}`}
      className={cn(
        'drop-area',
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
        `}
      </style>
      {children}
    </div>
  );
};

export default DroppableArea;
