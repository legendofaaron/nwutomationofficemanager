
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
      const sidebarElement = document.querySelector('.sidebar-container');
      if (sidebarElement) {
        const sidebarRect = sidebarElement.getBoundingClientRect();
        const newPosition = Math.max(16, Math.min(e.clientY - sidebarRect.top, sidebarRect.height - 80));
        setPosition(newPosition);
      }
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
