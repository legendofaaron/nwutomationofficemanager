
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDragDrop } from './DragDropContext';

interface DraggableItemProps {
  id: string;
  type: string;
  data: any;
  onDragStart?: (data: any, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  className?: string;
  children: React.ReactNode;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  type,
  data,
  onDragStart,
  onDragEnd,
  className,
  children
}) => {
  const { setIsDragging } = useDragDrop();
  const dragImageRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Create drag preview element
    const el = document.createElement('div');
    el.className = 'task-drag-preview';
    el.style.position = 'absolute';
    el.style.top = '-1000px';
    el.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
    el.style.color = 'white';
    el.style.padding = '6px 8px';
    el.style.borderRadius = '4px';
    el.style.fontSize = '12px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.maxWidth = '200px';
    el.style.whiteSpace = 'nowrap';
    el.style.overflow = 'hidden';
    el.style.textOverflow = 'ellipsis';
    el.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    
    document.body.appendChild(el);
    dragImageRef.current = el;
    
    return () => {
      if (el && document.body.contains(el)) {
        document.body.removeChild(el);
      }
    };
  }, []);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    // Set data
    const transferData = {
      id,
      type,
      ...data
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(transferData));
    
    // Set drag image
    if (dragImageRef.current) {
      const iconPrefix = type === 'task' ? '📋' : type === 'crew' ? '👥' : '🔄';
      dragImageRef.current.textContent = `${iconPrefix} ${data.title || id}`;
      e.dataTransfer.setDragImage(dragImageRef.current, 10, 10);
    }
    
    // Set effects
    e.dataTransfer.effectAllowed = 'move';
    
    // Set global dragging state
    setIsDragging(true);
    document.body.classList.add('dragging');
    
    // Call custom handler
    if (onDragStart) onDragStart(transferData, e);
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(false);
    document.body.classList.remove('dragging');
    
    // Call custom handler
    if (onDragEnd) onDragEnd(e);
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        'transition-all duration-200',
        className
      )}
      data-draggable-id={id}
      data-draggable-type={type}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
