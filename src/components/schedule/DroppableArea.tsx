
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useDragDrop } from './DragDropContext';

interface DroppableAreaProps {
  id: string;
  acceptTypes: string[];
  onDrop: (data: any, event: React.DragEvent) => void;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const DroppableArea: React.FC<DroppableAreaProps> = ({
  id,
  acceptTypes,
  onDrop,
  className,
  activeClassName = 'bg-blue-100 dark:bg-blue-900/20 border-dashed border-blue-400',
  children,
  disabled = false
}) => {
  const [isOver, setIsOver] = useState(false);
  const { isDragging, draggedItemType } = useDragDrop();
  
  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Try to read data type from the dataTransfer
      if (e.dataTransfer.types.includes('application/json')) {
        // Check if the dragged item type is acceptable
        const rawData = e.dataTransfer.getData('application/json');
        if (rawData) {
          try {
            const data = JSON.parse(rawData);
            if (acceptTypes.includes(data.type)) {
              setIsOver(true);
              e.dataTransfer.dropEffect = 'move';
            }
          } catch (error) {
            // If we can't parse the data, just check if we're in a general drag operation
            if (isDragging && acceptTypes.includes(draggedItemType || '')) {
              setIsOver(true);
              e.dataTransfer.dropEffect = 'move';
            }
          }
        } else if (isDragging && acceptTypes.includes(draggedItemType || '')) {
          // If no data is available but we know we're dragging an acceptable type
          setIsOver(true);
          e.dataTransfer.dropEffect = 'move';
        }
      }
    } catch (error) {
      // Browser security might prevent reading data during dragover
      // Just check if we're in a drag operation with an acceptable type
      if (isDragging && acceptTypes.includes(draggedItemType || '')) {
        setIsOver(true);
        e.dataTransfer.dropEffect = 'move';
      }
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const parsedData = JSON.parse(data);
        if (acceptTypes.includes(parsedData.type)) {
          onDrop(parsedData, e);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  return (
    <div
      id={`droppable-${id}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'transition-colors duration-200',
        className,
        isOver && !disabled && activeClassName,
        isDragging && acceptTypes.includes(draggedItemType || '') && !disabled && 'valid-drop-target'
      )}
      data-droppable-id={id}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
