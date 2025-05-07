
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DragDropContextType {
  isDragging: boolean;
  draggedItem: any;
  setIsDragging: (isDragging: boolean) => void;
  setDraggedItem: (item: any) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const DragDropProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);

  return (
    <DragDropContext.Provider value={{
      isDragging,
      draggedItem,
      setIsDragging,
      setDraggedItem
    }}>
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};
