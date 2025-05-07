
import { useState } from 'react';
import { Todo, DroppedItem, TaskFormValues } from '../CalendarTypes';
import { getTextByItemType, capitalizeFirstLetter } from '../CalendarUtils';
import { normalizeDate, isSameDay } from '../CalendarUtils';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface CalendarActionsProps {
  contextTodos: Todo[];
  setContextTodos: (todos: Todo[]) => void;
  setDraggedTodo: (todo: Todo | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
  setContextDate: (date: Date) => void;  // Properly define this property
}

// Hook for handling calendar actions (adding/editing/deleting todos)
export const useCalendarActions = ({
  contextTodos,
  setContextTodos,
  setDraggedTodo,
  setIsDragging,
  setSelectedDate,
  selectedDate,
  setContextDate
}: CalendarActionsProps) => {
  
  // Add a simple todo with just text
  const addTodo = (newTodoText: string) => {
    if (newTodoText.trim() === '') return;
    
    const newTodo = {
      id: Date.now().toString(),
      text: newTodoText,
      title: newTodoText, // Ensure title is always set
      completed: false,
      date: selectedDate
    };
    
    setContextTodos([...contextTodos, newTodo]);
    toast.success("Task created successfully");
  };

  // Add a todo with full form data
  const onSubmitNewTask = (values: TaskFormValues) => {
    const newTodo = {
      id: Date.now().toString(),
      text: values.text,
      title: values.text, // Ensure title is always set
      completed: false,
      date: values.date || selectedDate,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      assignedTo: values.assignedTo
    };
    
    setContextTodos([...contextTodos, newTodo]);
    toast.success("Task created successfully");
  };

  // Add a todo for an employee
  const onSubmitEmployeeTask = (values: TaskFormValues, droppedItem: DroppedItem) => {
    if (!droppedItem || droppedItem.type !== 'employee') return;

    const newTodo = {
      id: Date.now().toString(),
      text: values.text,
      title: values.text, // Ensure title is always set
      completed: false,
      date: values.date || selectedDate,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      assignedTo: droppedItem.originalData?.name || droppedItem.text.split(' - ')[1],
      assignedToAvatar: droppedItem.originalData?.avatarUrl
    };
    
    setContextTodos([...contextTodos, newTodo]);
    toast.success(`Task assigned to ${newTodo.assignedTo}`);
  };

  // Add a todo for a crew
  const onSubmitCrewTask = (values: TaskFormValues, droppedItem: DroppedItem) => {
    if (!droppedItem || droppedItem.type !== 'crew') return;

    const crewName = droppedItem.originalData?.name || droppedItem.text.split(' - ')[1];
    const newTodo = {
      id: Date.now().toString(),
      text: values.text,
      title: values.text, // Ensure title is always set
      completed: false,
      date: values.date || selectedDate,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      crewId: droppedItem.id,
      crewName: crewName,
      crewMembers: droppedItem.originalData?.members || []
    };
    
    setContextTodos([...contextTodos, newTodo]);
    toast.success(`Task assigned to ${crewName} crew`);
  };

  // Toggle completion of a todo
  const toggleTodoCompletion = (id: string) => {
    setContextTodos(
      contextTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setContextTodos(contextTodos.filter(todo => todo.id !== id));
    toast.info("Task removed");
  };

  // Handle drag start for a todo
  const handleDragStart = (todo: Todo, e: React.DragEvent) => {
    setDraggedTodo(todo);
    setIsDragging(true);
    
    // Set a custom drag image (optional)
    const dragImage = document.createElement('div');
    dragImage.innerHTML = `<div class="bg-primary text-white px-2 py-1 rounded text-xs">${todo.text}</div>`;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Set the data transfer for todos
    e.dataTransfer.setData("application/json", JSON.stringify({
      id: todo.id,
      text: todo.text,
      type: 'todo',
      originalData: todo
    }));
    
    // Clean up after drag operation starts
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedTodo(null);
    setIsDragging(false);
  };

  // Handle dragging over calendar
  const handleCalendarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle date change in calendar
  const handleDateChange = (date: Date | undefined, draggedTodo: Todo | null) => {
    if (date) {
      // Normalize the date before setting it to ensure consistent comparison
      const normalizedDate = normalizeDate(date);
      setSelectedDate(normalizedDate);
      
      // If there's a todo being dragged, update its date
      if (draggedTodo) {
        const updatedTodos = contextTodos.map(todo => 
          todo.id === draggedTodo.id 
            ? { ...todo, date: normalizedDate } 
            : todo
        );
        setContextTodos(updatedTodos);
        setDraggedTodo(null);
        toast.success("Task moved to " + format(normalizedDate, 'MMM d, yyyy'));
      }
    }
  };

  // Handle dropped items from external components
  const handleExternalItemDrop = (droppedItem: DroppedItem, date: Date) => {
    // For other types, create a new todo directly
    const newTodo = {
      id: `${droppedItem.type}-${droppedItem.id}-${Date.now()}`,
      text: getTextByItemType(droppedItem),
      title: getTextByItemType(droppedItem), // Add title for compatibility
      completed: false,
      date: date
    };

    setContextTodos([...contextTodos, newTodo]);
    toast.success(`${capitalizeFirstLetter(droppedItem.type)} added to calendar on ${format(date, 'MMM d, yyyy')}`);
  };

  // Handle dropping on a day cell
  const handleDayDrop = (date: Date, e: React.DragEvent, draggedTodo: Todo | null) => {
    // Handle todo drops
    if (draggedTodo) {
      const updatedTodos = contextTodos.map(todo => 
        todo.id === draggedTodo.id 
          ? { ...todo, date } 
          : todo
      );
      setContextTodos(updatedTodos);
      setDraggedTodo(null);
      setIsDragging(false);
      setSelectedDate(date);
      setContextDate(date);
      toast.success("Task moved to " + format(date, 'MMM d, yyyy'));
    } else {
      // Handle external drops (employees, crews, invoices, bookings)
      try {
        const droppedData = e.dataTransfer.getData("application/json");
        if (droppedData) {
          const droppedItem: DroppedItem = JSON.parse(droppedData);
          
          if (droppedItem.type === 'employee' || droppedItem.type === 'crew') {
            // These will be handled by separate dialogs
            return { droppedItem, date };
          } else {
            // Handle other item types directly
            handleExternalItemDrop(droppedItem, date);
          }
          
          // Update selected date to where the item was dropped
          setSelectedDate(date);
          setContextDate(date);
        }
      } catch (error) {
        console.error("Error processing dropped item:", error);
      }
    }
    
    return null;
  };

  return {
    addTodo,
    onSubmitNewTask,
    onSubmitEmployeeTask,
    onSubmitCrewTask,
    toggleTodoCompletion,
    deleteTodo,
    handleDragStart,
    handleDragEnd,
    handleCalendarDragOver,
    handleDateChange,
    handleDayDrop
  };
};
