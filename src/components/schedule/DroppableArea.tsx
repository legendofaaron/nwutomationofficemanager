
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  
  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Try to read data type
      if (e.dataTransfer.types.includes('application/json')) {
        setIsOver(true);
        e.dataTransfer.dropEffect = 'move';
      }
    } catch (error) {
      // Browser security might prevent reading data
      // Just check if any data is being dragged
      setIsOver(true);
      e.dataTransfer.dropEffect = 'move';
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
        isOver && !disabled && activeClassName
      )}
      data-droppable-id={id}
    >
      {children}
    </div>
  );
};

export default DroppableArea;
