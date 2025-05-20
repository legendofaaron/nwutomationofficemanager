
import React, { useCallback } from 'react';
import { useScheduleState } from '@/hooks/useScheduleState';
import ScheduleHeader from './schedule/components/ScheduleHeader';
import ScheduleTabs from './schedule/components/ScheduleTabs';
import TaskEditDialogWrapper from './schedule/components/TaskEditDialogWrapper';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

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

  // Get theme information for styling
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';

  // Memoize the handlers to prevent unnecessary re-renders
  const memoizedToggleCompletion = useCallback(handleToggleTaskCompletion, [handleToggleTaskCompletion]);
  const memoizedMoveTask = useCallback(handleMoveTask, [handleMoveTask]);
  const memoizedEditTask = useCallback(handleEditTask, [handleEditTask]);
  const memoizedSaveChanges = useCallback(handleSaveTaskChanges, [handleSaveTaskChanges]);
  const memoizedAddNewTask = useCallback(handleAddNewTask, [handleAddNewTask]);
  const memoizedDateChange = useCallback(handleDateChange, [handleDateChange]);
  const memoizedSetViewMode = useCallback(setViewMode, [setViewMode]);
  const memoizedSetActiveFilter = useCallback(setActiveFilter, [setActiveFilter]);
  
  // Dynamic styling based on theme
  const containerClass = cn(
    "space-y-6",
    isDark ? "text-gray-100" : "text-gray-900",
    isSuperDark ? "bg-black" : isDark ? "bg-[#0D1117]" : "bg-white"
  );

  return (
    <div className={containerClass}>
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
