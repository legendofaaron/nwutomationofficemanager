
import { useState, useRef, useEffect } from 'react';

interface UseDraggableOptions {
  id: string;
  type: string;
  data?: any;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
}

interface UseDroppableOptions {
  accept: string[];
  onDrop: (data: any, event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
}

export function useDraggable({ id, type, data, onDragStart, onDragEnd }: UseDraggableOptions) {
  const [isDragging, setIsDragging] = useState(false);
  
  // Create custom drag image
  const dragImageRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const dragImage = document.createElement('div');
    dragImage.className = 'task-drag-preview';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    
    dragImageRef.current = dragImage;
    
    return () => {
      if (dragImage && document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    };
  }, []);
  
  const handleDragStart = (event: React.DragEvent) => {
    setIsDragging(true);
    
    // Set data transfer
    event.dataTransfer.setData('application/json', JSON.stringify({
      id,
      type,
      ...data
    }));
    
    // Set drag image if available
    if (dragImageRef.current) {
      dragImageRef.current.textContent = `${type === 'task' ? '📋' : '👥'} ${data?.title || type}`;
      event.dataTransfer.setDragImage(dragImageRef.current, 10, 10);
    }
    
    // Add effects
    event.dataTransfer.effectAllowed = 'move';
    
    // Call custom handler if provided
    if (onDragStart) onDragStart(event);
  };
  
  const handleDragEnd = (event: React.DragEvent) => {
    setIsDragging(false);
    
    // Call custom handler if provided
    if (onDragEnd) onDragEnd(event);
  };
  
  return {
    isDragging,
    dragProps: {
      draggable: true,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    }
  };
}

export function useDroppable({ accept, onDrop, onDragOver, onDragLeave }: UseDroppableOptions) {
  const [isOver, setIsOver] = useState(false);
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    
    // Try to read the data to see if it's of an accepted type
    try {
      const rawData = event.dataTransfer.getData('application/json');
      if (rawData) {
        const data = JSON.parse(rawData);
        if (accept.includes(data.type)) {
          setIsOver(true);
          event.dataTransfer.dropEffect = 'move';
          
          // Call custom handler if provided
          if (onDragOver) onDragOver(event);
        }
      }
    } catch (error) {
      // Fail silently - we might not be able to access the data due to browser security
      // Just check if there is any data being dragged
      if (event.dataTransfer.types.includes('application/json')) {
        setIsOver(true);
        event.dataTransfer.dropEffect = 'move';
        
        // Call custom handler if provided
        if (onDragOver) onDragOver(event);
      }
    }
  };
  
  const handleDragLeave = (event: React.DragEvent) => {
    setIsOver(false);
    
    // Call custom handler if provided
    if (onDragLeave) onDragLeave(event);
  };
  
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsOver(false);
    
    try {
      const rawData = event.dataTransfer.getData('application/json');
      if (rawData) {
        const data = JSON.parse(rawData);
        if (accept.includes(data.type)) {
          onDrop(data, event);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  return {
    isOver,
    dropProps: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop
    }
  };
}
