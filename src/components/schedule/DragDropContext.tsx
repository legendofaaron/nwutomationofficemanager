
import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { DraggableItemType, DragItem, DragStartEventData, DragEndEventData } from './ScheduleTypes';
import { useCalendarSync } from '@/context/CalendarSyncContext';
import { toast } from '@/hooks/use-toast';

// Enhanced context type with improved drag and drop tracking
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
  lastDragOperation: { timestamp: number; sourceId: string; targetId: string | null; itemType: string } | null;
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

// Provider component with enhanced drag feedback
interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [dropTargets, setDropTargets] = useState<Record<string, DraggableItemType[]>>({});
  const [lastDragOperation, setLastDragOperation] = useState<{ timestamp: number; sourceId: string; targetId: string | null; itemType: string } | null>(null);
  const { setDraggingItem, setLastDragOperation: setGlobalDragOperation } = useCalendarSync();
  
  // Use refs to prevent stale closures in drag event handlers
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;
  
  const draggedItemRef = useRef(draggedItem);
  draggedItemRef.current = draggedItem;
  
  // Sync dragging state with global calendar context
  useEffect(() => {
    if (draggedItem) {
      setDraggingItem({
        type: draggedItem.type,
        id: draggedItem.id,
        data: draggedItem.data
      });
    } else {
      setDraggingItem(null);
    }
  }, [draggedItem, setDraggingItem]);
  
  // Add global event listeners for improved drag and drop reliability
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      if (isDraggingRef.current) {
        endDrag(false);
      }
    };
    
    document.addEventListener('dragend', handleGlobalDragEnd);
    document.addEventListener('mouseup', handleGlobalDragEnd);
    
    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd);
      document.removeEventListener('mouseup', handleGlobalDragEnd);
    };
  }, []);
  
  // Start drag operation with enhanced visual feedback
  const startDrag = useCallback((data: DragStartEventData) => {
    // Prevent duplicate drag events
    if (isDraggingRef.current && draggedItemRef.current?.id === data.item.id) {
      return;
    }
    
    setIsDragging(true);
    setDraggedItem(data.item);
    
    // Set the drag source for deduplication
    const dragOperation = {
      timestamp: Date.now(),
      sourceId: data.item.id,
      targetId: null,
      itemType: data.item.type
    };
    
    setLastDragOperation(dragOperation);
    setGlobalDragOperation({
      itemType: data.item.type,
      itemId: data.item.id,
      sourceId: data.item.sourceContainerId || '',
      targetDate: null,
      timestamp: Date.now()
    });
    
    // Add global event listeners that might be needed
    document.body.classList.add('dragging');
    
    // Create ghost drag image if needed
    if (data.node && !data.customDragImage) {
      try {
        const rect = data.node.getBoundingClientRect();
        const ghostEl = document.createElement('div');
        ghostEl.style.position = 'absolute';
        ghostEl.style.top = '-1000px';
        ghostEl.style.opacity = '0';
        ghostEl.innerHTML = `<div class="drag-ghost ${data.item.type}-ghost">${data.item.data?.title || data.item.data?.name || 'Item'}</div>`;
        document.body.appendChild(ghostEl);
        
        setTimeout(() => {
          if (document.body.contains(ghostEl)) {
            document.body.removeChild(ghostEl);
          }
        }, 100);
      } catch (err) {
        console.warn('Error creating drag ghost:', err);
      }
    }
    
    // Enhanced visual feedback
    if (data.node) {
      data.node.classList.add('dragging');
    }
  }, [setGlobalDragOperation]);
  
  // End drag operation with improved cleanup
  const endDrag = useCallback((dropped: boolean, dropTarget?: string) => {
    // If dropped successfully, update the last drag operation
    if (dropped && dropTarget && draggedItemRef.current) {
      const dragOperation = {
        timestamp: Date.now(),
        sourceId: draggedItemRef.current.id,
        targetId: dropTarget,
        itemType: draggedItemRef.current.type
      };
      
      setLastDragOperation(dragOperation);
      setGlobalDragOperation({
        itemType: draggedItemRef.current.type,
        itemId: draggedItemRef.current.id,
        sourceId: draggedItemRef.current.sourceContainerId || '',
        targetDate: null,
        timestamp: Date.now()
      });
      
      // Visual feedback for successful drop
      toast({
        title: "Item moved",
        description: `${draggedItemRef.current.type.charAt(0).toUpperCase() + draggedItemRef.current.type.slice(1)} was moved successfully`,
        variant: "default",
        duration: 2000
      });
    }
    
    setIsDragging(false);
    setDraggedItem(null);
    setDragOverTarget(null);
    
    // Clean up any global state
    document.body.classList.remove('dragging');
    
    // Remove any active drag classes from elements
    document.querySelectorAll('.dragging').forEach(el => {
      el.classList.remove('dragging');
    });
    
    document.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    
    // Clear global dragging state
    setDraggingItem(null);
  }, [setGlobalDragOperation, setDraggingItem]);
  
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
