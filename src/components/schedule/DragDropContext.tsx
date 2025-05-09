
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface DragDropContextType {
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  draggedItem: any | null;
  setDraggedItem: React.Dispatch<React.SetStateAction<any | null>>;
  dragType: string | null;
  setDragType: React.Dispatch<React.SetStateAction<string | null>>;
  dragSource: string | null;
  setDragSource: React.Dispatch<React.SetStateAction<string | null>>;
  // Add the draggedItemType property
  draggedItemType: string | null;
  setDraggedItemType: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context
const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

// Provider component
export const DragDropProvider = ({ children }: { children: ReactNode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<any | null>(null);
  const [dragType, setDragType] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [draggedItemType, setDraggedItemType] = useState<string | null>(null);

  return (
    <DragDropContext.Provider value={{
      isDragging,
      setIsDragging,
      draggedItem,
      setDraggedItem,
      dragType,
      setDragType,
      dragSource,
      setDragSource,
      draggedItemType,
      setDraggedItemType
    }}>
      <div className="drag-drop-container">
        {children}
      </div>
    </DragDropContext.Provider>
  );
};

// Custom hook to use the context
export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};
