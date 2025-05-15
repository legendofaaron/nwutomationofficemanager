
import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { DraggableItemType, DragItem, DragStartEventData, DragEndEventData } from './ScheduleTypes';

// Define the context type
interface DragDropContextType {
  isDragging: boolean;
  draggedItem: DragItem | null;
  dragOverTarget: string | null;
  dropTargets: Record<string, DraggableItemType[]>;
  startDrag: (data: DragStartEventData) => void;
  endDrag: (dropped: boolean, dropTarget?: string) => void;
  registerDropTarget: (id: string, acceptTypes: DraggableItemType[]) => void;
  unregisterDropTarget: (id: string) => void;
  setDragOverTarget: (id: string | null) => void;
  lastDragOperation: { timestamp: number; sourceId: string; targetId: string | null } | null;
}

// Create context with default values
const DragDropContext = createContext<DragDropContextType>({
  isDragging: false,
  draggedItem: null,
  dragOverTarget: null,
  dropTargets: {},
  startDrag: () => {},
  endDrag: () => {},
  registerDropTarget: () => {},
  unregisterDropTarget: () => {},
  setDragOverTarget: () => {},
  lastDragOperation: null,
});

// Provider component
interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [dropTargets, setDropTargets] = useState<Record<string, DraggableItemType[]>>({});
  const [lastDragOperation, setLastDragOperation] = useState<{ timestamp: number; sourceId: string; targetId: string | null } | null>(null);
  
  // Use refs to prevent stale closures in drag event handlers
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;
  
  const draggedItemRef = useRef(draggedItem);
  draggedItemRef.current = draggedItem;
  
  // Start drag operation
  const startDrag = useCallback((data: DragStartEventData) => {
    // Prevent duplicate drag events
    if (isDraggingRef.current && draggedItemRef.current?.id === data.item.id) {
      return;
    }
    
    setIsDragging(true);
    setDraggedItem(data.item);
    
    // Set the drag source for deduplication
    setLastDragOperation({
      timestamp: Date.now(),
      sourceId: data.item.id,
      targetId: null
    });
    
    // Optional: Add global event listeners that might be needed
    document.body.classList.add('dragging');
  }, []);
  
  // End drag operation
  const endDrag = useCallback((dropped: boolean, dropTarget?: string) => {
    // If dropped successfully, update the last drag operation
    if (dropped && dropTarget && draggedItemRef.current) {
      setLastDragOperation({
        timestamp: Date.now(),
        sourceId: draggedItemRef.current.id,
        targetId: dropTarget
      });
    }
    
    setIsDragging(false);
    setDraggedItem(null);
    setDragOverTarget(null);
    
    // Clean up any global state
    document.body.classList.remove('dragging');
  }, []);
  
  // Register a drop target
  const registerDropTarget = useCallback((id: string, acceptTypes: DraggableItemType[]) => {
    setDropTargets(prev => ({
      ...prev,
      [id]: acceptTypes
    }));
  }, []);
  
  // Unregister a drop target
  const unregisterDropTarget = useCallback((id: string) => {
    setDropTargets(prev => {
      const newTargets = { ...prev };
      delete newTargets[id];
      return newTargets;
    });
  }, []);
  
  // Context value
  const value = {
    isDragging,
    draggedItem,
    dragOverTarget,
    dropTargets,
    startDrag,
    endDrag,
    registerDropTarget,
    unregisterDropTarget,
    setDragOverTarget,
    lastDragOperation
  };
  
  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};

// Hook to use the context
export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

export default DragDropProvider;
