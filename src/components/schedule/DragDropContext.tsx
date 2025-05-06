
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import './dragAndDrop.css';

interface DragDropContextType {
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  draggedItemId: string | null;
  setDraggedItemId: React.Dispatch<React.SetStateAction<string | null>>;
  draggedItemType: 'task' | 'crew' | null;
  setDraggedItemType: React.Dispatch<React.SetStateAction<'task' | 'crew' | null>>;
  draggedItemData: any;
  setDraggedItemData: React.Dispatch<React.SetStateAction<any>>;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedItemType, setDraggedItemType] = useState<'task' | 'crew' | null>(null);
  const [draggedItemData, setDraggedItemData] = useState<any>(null);

  // Effect to handle global drag state
  useEffect(() => {
    // Handle body class for cursor changes
    if (isDragging) {
      document.body.classList.add('dragging');
    } else {
      document.body.classList.remove('dragging');
    }

    // Handle escape key to cancel drag
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDragging) {
        setIsDragging(false);
        setDraggedItemId(null);
        setDraggedItemType(null);
        setDraggedItemData(null);
        toast.info('Drag operation cancelled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.body.classList.remove('dragging');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDragging]);

  const value = {
    isDragging,
    setIsDragging,
    draggedItemId,
    setDraggedItemId,
    draggedItemType,
    setDraggedItemType,
    draggedItemData,
    setDraggedItemData
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};
