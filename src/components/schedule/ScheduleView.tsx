
import React, { useCallback, useMemo } from 'react';
import { useScheduleState } from '@/hooks/useScheduleState';
import ScheduleHeader from './components/ScheduleHeader';
import ScheduleTabs from './components/ScheduleTabs';
import TaskEditDialogWrapper from './components/TaskEditDialogWrapper';

/**
 * ScheduleView Component
 * 
 * A comprehensive schedule management component that allows users to view, filter,
 * and manage tasks in both calendar and list views.
 */
const ScheduleView: React.FC = () => {
  // Use the custom hook to manage all schedule state and actions
  const {
    viewMode,
    setViewMode,
    filteredTasks,
    selectedDate,
    editingTask,
    isEditDialogOpen,
    setIsEditDialogOpen,
    activeFilter,
    setActiveFilter,
    crews,
    employees,
    clients,
    clientLocations,
    handleToggleTaskCompletion,
    handleMoveTask,
    handleEditTask,
    handleSaveTaskChanges,
    handleAddNewTask,
    handleDateChange
  } = useScheduleState();

  // Memoize the handlers to prevent unnecessary re-renders
  const memoizedToggleCompletion = useCallback(handleToggleTaskCompletion, [handleToggleTaskCompletion]);
  const memoizedMoveTask = useCallback(handleMoveTask, [handleMoveTask]);
  const memoizedEditTask = useCallback(handleEditTask, [handleEditTask]);
  const memoizedSaveChanges = useCallback(handleSaveTaskChanges, [handleSaveTaskChanges]);
  const memoizedAddNewTask = useCallback(handleAddNewTask, [handleAddNewTask]);
  const memoizedDateChange = useCallback(handleDateChange, [handleDateChange]);
  const memoizedSetViewMode = useCallback(setViewMode, [setViewMode]);
  const memoizedSetActiveFilter = useCallback(setActiveFilter, [setActiveFilter]);

  return (
    <div className="space-y-6">
      {/* Header with title and filters */}
      <ScheduleHeader
        employees={employees}
        crews={crews}
        clients={clients}
        currentFilter={activeFilter}
        onFilterChange={memoizedSetActiveFilter}
      />
      
      {/* Tabs for switching between calendar and list views */}
      <ScheduleTabs
        viewMode={viewMode}
        onViewModeChange={memoizedSetViewMode}
        filteredTasks={filteredTasks}
        selectedDate={selectedDate}
        onSelectDate={memoizedDateChange}
        onToggleTaskCompletion={memoizedToggleCompletion}
        onEditTask={memoizedEditTask}
        crews={crews}
        clients={clients}
        clientLocations={clientLocations}
        activeFilter={activeFilter}
        onAddNewTask={memoizedAddNewTask}
        onMoveTask={memoizedMoveTask}
      />
      
      {/* Task edit dialog */}
      <TaskEditDialogWrapper
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        task={editingTask}
        crews={crews}
        employees={employees}
        clients={clients}
        clientLocations={clientLocations}
        onSaveChanges={memoizedSaveChanges}
      />
    </div>
  );
};

export default React.memo(ScheduleView);
