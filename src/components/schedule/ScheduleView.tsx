
import React from 'react';
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

  return (
    <div className="space-y-6">
      {/* Header with title and filters */}
      <ScheduleHeader
        employees={employees}
        crews={crews}
        clients={clients}
        currentFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      
      {/* Tabs for switching between calendar and list views */}
      <ScheduleTabs
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filteredTasks={filteredTasks}
        selectedDate={selectedDate}
        onSelectDate={handleDateChange}
        onToggleTaskCompletion={handleToggleTaskCompletion}
        onEditTask={handleEditTask}
        crews={crews}
        clients={clients}
        clientLocations={clientLocations}
        activeFilter={activeFilter}
        onAddNewTask={handleAddNewTask}
        onMoveTask={handleMoveTask}
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
        onSaveChanges={handleSaveTaskChanges}
      />
    </div>
  );
};

export default ScheduleView;
