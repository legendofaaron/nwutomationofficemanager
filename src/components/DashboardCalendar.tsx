
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import hooks and utilities
import { useCalendarState } from './calendar/hooks/useCalendarState';
import { useCalendarActions } from './calendar/hooks/useCalendarActions';
import { useDialogHandlers } from './calendar/hooks/useDialogHandlers';
import { useAppContext } from '@/context/AppContext';

// Import components
import CalendarContainer from './calendar/CalendarContainer';
import CalendarDayView from './calendar/CalendarDayView';
import TaskInput from './calendar/TaskInput';
import TaskFormDialog from './calendar/TaskFormDialog';
import EmployeeTaskDialog from './calendar/EmployeeTaskDialog';
import CrewTaskDialog from './calendar/CrewTaskDialog';
import TaskListHeader from './calendar/TaskListHeader';

// Import types and utilities
import { getCrewDisplayCode } from './calendar/CalendarUtils';

const DashboardCalendar = () => {
  // Use the context hook to get crews
  const { crews, setCalendarDate } = useAppContext();
  
  // Use the calendar state hook to manage state
  const calendarState = useCalendarState();
  
  const {
    selectedDate,
    setSelectedDate,
    draggedTodo,
    setDraggedTodo,
    isDragging,
    setIsDragging,
    isDialogOpen,
    setIsDialogOpen,
    employeeTaskDialogOpen,
    setEmployeeTaskDialogOpen,
    crewTaskDialogOpen,
    setCrewTaskDialogOpen,
    droppedItem,
    setDroppedItem,
    calendarRef,
    currentMonth,
    setCurrentMonth,
    form,
    employeeTaskForm,
    crewTaskForm,
    todaysTodos,
    processedTodos,
    contextTodos,
    setContextTodos,
    getTaskCountForDay
  } = calendarState;
  
  // Use the calendar actions hook to handle actions
  const calendarActions = useCalendarActions({
    contextTodos,
    setContextTodos,
    setDraggedTodo,
    setIsDragging,
    setSelectedDate,
    selectedDate,
    setContextDate
  });
  
  const {
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
  } = calendarActions;
  
  // Use the dialog handlers hook
  const dialogHandlers = useDialogHandlers({
    droppedItem,
    setDroppedItem,
    setEmployeeTaskDialogOpen,
    setCrewTaskDialogOpen,
    employeeTaskForm,
    crewTaskForm
  });
  
  // Handle double click on a date to open the task dialog
  const handleDateDoubleClick = (date: Date) => {
    setSelectedDate(date);
    form.setValue('date', date);
    setIsDialogOpen(true);
  };
  
  // Handle calendar day drop with special handling for employees and crews
  const handleCalendarDayDrop = (date: Date, e: React.DragEvent) => {
    if (draggedTodo) {
      // Handle todo drops
      handleDayDrop(date, e, draggedTodo);
    } else {
      // Handle external drops
      try {
        const droppedData = e.dataTransfer.getData("application/json");
        if (droppedData) {
          const droppedItem = JSON.parse(droppedData);
          
          if (droppedItem.type === 'employee') {
            dialogHandlers.handleEmployeeTaskDialogOpen(droppedItem, date);
          } else if (droppedItem.type === 'crew') {
            dialogHandlers.handleCrewTaskDialogOpen(droppedItem, date);
          } else {
            // Handle other item types
            handleDayDrop(date, e, null);
          }
          
          // Update selected date
          setSelectedDate(date);
          setCalendarDate(date);
        }
      } catch (error) {
        console.error("Error processing dropped item:", error);
      }
    }
  };
  
  // Wrapper functions to handle task form submissions
  const handleTaskFormSubmit = (values: any) => {
    onSubmitNewTask(values);
    setIsDialogOpen(false);
    form.reset();
  };
  
  const handleEmployeeTaskSubmit = (values: any) => {
    if (droppedItem) {
      onSubmitEmployeeTask(values, droppedItem);
      setEmployeeTaskDialogOpen(false);
      employeeTaskForm.reset();
      setDroppedItem(null);
    }
  };
  
  const handleCrewTaskSubmit = (values: any) => {
    if (droppedItem) {
      onSubmitCrewTask(values, droppedItem);
      setCrewTaskDialogOpen(false);
      crewTaskForm.reset();
      setDroppedItem(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Container */}
      <CalendarContainer
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        handleDateChange={(date) => handleDateChange(date, draggedTodo)}
        getTaskCountForDay={getTaskCountForDay}
        isDragging={isDragging}
        onDateDoubleClick={handleDateDoubleClick}
        handleDayDrop={handleCalendarDayDrop}
        draggedTodo={draggedTodo}
        calendarRef={calendarRef}
        handleCalendarDragOver={handleCalendarDragOver}
      />
      
      {/* Task List */}
      <div className="flex-grow overflow-auto mt-2 min-h-0">
        <TaskListHeader 
          selectedDate={selectedDate}
          onAddTaskClick={() => setIsDialogOpen(true)}
        />
        
        <TaskInput onAddTodo={addTodo} />
        
        <div className="space-y-0.5 max-h-[100px] bg-card rounded-md p-1.5 overflow-y-auto">
          <CalendarDayView 
            todos={todaysTodos} 
            selectedDate={selectedDate}
            toggleTodoCompletion={toggleTodoCompletion}
            deleteTodo={deleteTodo}
            getCrewDisplayCode={(crewId) => getCrewDisplayCode(crewId, crews)}
          />
        </div>
      </div>

      {/* Task Dialogs */}
      <TaskFormDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={handleTaskFormSubmit}
        title="Add New Task"
      />

      <EmployeeTaskDialog
        isOpen={employeeTaskDialogOpen}
        onOpenChange={setEmployeeTaskDialogOpen}
        droppedItem={droppedItem}
        form={employeeTaskForm}
        onSubmit={handleEmployeeTaskSubmit}
      />
      
      <CrewTaskDialog 
        isOpen={crewTaskDialogOpen}
        onOpenChange={setCrewTaskDialogOpen}
        droppedItem={droppedItem}
        form={crewTaskForm}
        onSubmit={handleCrewTaskSubmit}
      />
    </div>
  );
};

export default DashboardCalendar;
