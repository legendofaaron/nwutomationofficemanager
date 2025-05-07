
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DragDropContextType {
  isDragging: boolean;
  draggedItem: any;
  draggedItemId: string | null;
  draggedItemType: string | null;
  draggedItemData: any;
  setIsDragging: (isDragging: boolean) => void;
  setDraggedItem: (item: any) => void;
  setDraggedItemId: (id: string | null) => void;
  setDraggedItemType: (type: string | null) => void;
  setDraggedItemData: (data: any) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const DragDropProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedItemType, setDraggedItemType] = useState<string | null>(null);
  const [draggedItemData, setDraggedItemData] = useState<any>(null);

  return (
    <DragDropContext.Provider value={{
      isDragging,
      draggedItem,
      draggedItemId,
      draggedItemType,
      draggedItemData,
      setIsDragging,
      setDraggedItem,
      setDraggedItemId,
      setDraggedItemType,
      setDraggedItemData
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
