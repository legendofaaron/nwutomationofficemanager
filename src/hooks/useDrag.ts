
import { useState, useRef, useCallback } from 'react';

export const useDrag = (initialPosition: number = 24) => {
  const [position, setPosition] = useState(initialPosition);
  const isDragging = useRef(false);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  }, []);

  const handleDrag = useCallback((e: MouseEvent) => {
    if (isDragging.current) {
      // Get the height of the viewport
      const viewportHeight = window.innerHeight;
      
      // Calculate percentage based on mouse position
      const percentage = (e.clientY / viewportHeight) * 100;
      
      // Limit the position to stay within reasonable bounds (10% - 90%)
      const newPosition = Math.max(10, Math.min(percentage, 90));
      
      setPosition(newPosition);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  }, []);

  return {
    position,
    handleDragStart
  };
};
