
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { toast } from 'sonner';
import { DragItem, DraggableItemType, DragStartEventData, DragEndEventData } from './ScheduleTypes';

interface DragDropContextType {
  // Drag state
  isDragging: boolean;
  draggedItem: DragItem | null;
  dragStartPosition: { x: number, y: number } | null;
  dragOverTarget: string | null;
  
  // Event handlers
  startDrag: (data: DragStartEventData) => void;
  endDrag: (dropped: boolean, dropTargetId?: string) => void;
  setDragOverTarget: (id: string | null) => void;
  
  // Registration
  registerDropTarget: (id: string, acceptTypes: DraggableItemType[], sortOrder?: number) => void;
  unregisterDropTarget: (id: string) => void;
  canAcceptType: (targetId: string, itemType: DraggableItemType) => boolean;
  
  // Utils
  getDragOverlay: () => HTMLElement | null;
  updateDragOverlayPosition: (x: number, y: number) => void;
}

interface DragDropProviderProps {
  children: ReactNode;
}

// Create context
const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

// Custom hook to use drag and drop context
export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

// Provider component
export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  // State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number, y: number } | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  
  // Refs
  const dropTargets = useRef<Map<string, { acceptTypes: DraggableItemType[], sortOrder: number }>>(new Map());
  const dragOverlayRef = useRef<HTMLDivElement | null>(null);
  
  // Create drag overlay element on mount
  useEffect(() => {
    const dragOverlay = document.createElement('div');
    dragOverlay.id = 'drag-overlay';
    dragOverlay.style.position = 'fixed';
    dragOverlay.style.pointerEvents = 'none';
    dragOverlay.style.zIndex = '9999';
    dragOverlay.style.opacity = '0.8';
    dragOverlay.style.transform = 'translate(-50%, -50%)';
    dragOverlay.style.display = 'none';
    dragOverlay.className = 'drag-overlay';
    
    document.body.appendChild(dragOverlay);
    dragOverlayRef.current = dragOverlay;
    
    return () => {
      if (dragOverlay && document.body.contains(dragOverlay)) {
        document.body.removeChild(dragOverlay);
      }
    };
  }, []);
  
  // Global event listeners for drag actions
  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('dragging');
      
      // Handle escape key to cancel drag
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isDragging) {
          cancelDrag();
          toast.info('Drag operation cancelled');
        }
      };
      
      // Track mouse movement for drag overlay
      const handleMouseMove = (e: MouseEvent) => {
        if (dragOverlayRef.current && isDragging) {
          updateDragOverlayPosition(e.clientX, e.clientY);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('mousemove', handleMouseMove);
      
      // Cleanup function
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    } else {
      document.body.classList.remove('dragging');
    }
  }, [isDragging]);
  
  // Cancel drag operation
  const cancelDrag = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setDragStartPosition(null);
    setDragOverTarget(null);
    
    if (dragOverlayRef.current) {
      dragOverlayRef.current.style.display = 'none';
    }
  };
  
  // Start drag operation
  const startDrag = (data: DragStartEventData) => {
    setIsDragging(true);
    setDraggedItem(data.item);
    setDragStartPosition({ x: data.clientX, y: data.clientY });
    
    // Create drag preview content
    createDragPreview(data);
    
    // Set initial position
    updateDragOverlayPosition(data.clientX, data.clientY);
    
    // Trigger custom drag start event
    window.dispatchEvent(new CustomEvent('app-drag-start', { detail: data }));
  };
  
  // Create visual drag preview
  const createDragPreview = (data: DragStartEventData) => {
    if (!dragOverlayRef.current) return;
    
    const overlay = dragOverlayRef.current;
    const { item, node } = data;
    
    // Clear any previous content
    overlay.innerHTML = '';
    
    // Create preview based on item type
    let preview: HTMLElement;
    
    switch (item.type) {
      case 'task':
        preview = document.createElement('div');
        preview.className = 'task-drag-preview';
        preview.innerHTML = `<div class="flex items-center gap-1.5 px-2 py-1 bg-primary text-primary-foreground rounded-md shadow-md whitespace-nowrap text-sm max-w-[200px] truncate">
          <span class="inline-block">📋</span> ${item.data.title || 'Task'}
        </div>`;
        break;
        
      case 'employee':
        preview = document.createElement('div');
        preview.className = 'employee-drag-preview';
        preview.innerHTML = `<div class="flex items-center gap-1.5 px-2 py-1 bg-blue-500 text-white rounded-md shadow-md whitespace-nowrap text-sm max-w-[200px] truncate">
          <span class="inline-block">👤</span> ${item.data.name || 'Employee'}
        </div>`;
        break;
        
      case 'crew':
        preview = document.createElement('div');
        preview.className = 'crew-drag-preview';
        preview.innerHTML = `<div class="flex items-center gap-1.5 px-2 py-1 bg-green-500 text-white rounded-md shadow-md whitespace-nowrap text-sm max-w-[200px] truncate">
          <span class="inline-block">👥</span> ${item.data.name || 'Crew'}
        </div>`;
        break;
        
      case 'client':
      case 'location':
      default:
        preview = document.createElement('div');
        preview.className = 'default-drag-preview';
        preview.innerHTML = `<div class="flex items-center gap-1.5 px-2 py-1 bg-gray-800 text-white rounded-md shadow-md whitespace-nowrap text-sm max-w-[200px] truncate">
          <span class="inline-block">📍</span> ${item.data.name || 'Item'}
        </div>`;
    }
    
    overlay.appendChild(preview);
    overlay.style.display = 'block';
  };
  
  // End drag operation
  const endDrag = (dropped: boolean, dropTargetId?: string) => {
    const dragEndEvent: DragEndEventData = {
      item: draggedItem!,
      dropped,
      dropTarget: dropTargetId
    };
    
    // Reset state
    setIsDragging(false);
    setDraggedItem(null);
    setDragStartPosition(null);
    setDragOverTarget(null);
    
    // Hide drag overlay
    if (dragOverlayRef.current) {
      dragOverlayRef.current.style.display = 'none';
    }
    
    // Trigger custom drag end event
    window.dispatchEvent(new CustomEvent('app-drag-end', { detail: dragEndEvent }));
  };
  
  // Get drag overlay element
  const getDragOverlay = () => dragOverlayRef.current;
  
  // Update drag overlay position
  const updateDragOverlayPosition = (x: number, y: number) => {
    if (dragOverlayRef.current && isDragging) {
      dragOverlayRef.current.style.left = `${x}px`;
      dragOverlayRef.current.style.top = `${y}px`;
    }
  };
  
  // Register drop target
  const registerDropTarget = (id: string, acceptTypes: DraggableItemType[], sortOrder: number = 0) => {
    dropTargets.current.set(id, { acceptTypes, sortOrder });
  };
  
  // Unregister drop target
  const unregisterDropTarget = (id: string) => {
    dropTargets.current.delete(id);
  };
  
  // Check if target can accept dragged item type
  const canAcceptType = (targetId: string, itemType: DraggableItemType): boolean => {
    const target = dropTargets.current.get(targetId);
    return !!target && target.acceptTypes.includes(itemType);
  };
  
  const value: DragDropContextType = {
    isDragging,
    draggedItem,
    dragStartPosition,
    dragOverTarget,
    startDrag,
    endDrag,
    setDragOverTarget,
    registerDropTarget,
    unregisterDropTarget,
    canAcceptType,
    getDragOverlay,
    updateDragOverlayPosition
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};

export default DragDropProvider;
