
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, List, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import hooks
import { useScheduleTasks } from './hooks/useScheduleTasks';
import { useTaskDialogs } from './hooks/useTaskDialogs';
import { useScheduleFiltering } from './hooks/useScheduleFiltering';
import { useDragDrop } from './hooks/useDragDrop';
import { useScheduleDownload } from './hooks/useScheduleDownload';

// Import components
import TaskCalendarView from './TaskCalendarView';
import TaskListView from './TaskListView';
import TeamEventDialog from './TeamEventDialog';
import TaskEditDialog from './TaskEditDialog';
import ScheduleFilterBar from './ScheduleFilterBar';
import UploadAnalyzeSection from './UploadAnalyzeSection';
import ScheduleHeader from './components/ScheduleHeader';
import ScheduleGuide from './components/ScheduleGuide';

const ScheduleView = () => {
  // Use custom hooks
  const {
    selectedDate,
    setSelectedDate,
    tasks,
    setTasks,
    handleToggleTaskCompletion,
    handleMoveTask,
    handleSaveTaskChanges,
    handleApplyScheduleData,
    employees,
    crews,
    clients,
    clientLocations
  } = useScheduleTasks();
  
  const {
    currentFilter,
    getFilteredTasks,
    handleFilterChange
  } = useScheduleFiltering();
  
  const {
    currentEditTask,
    setCurrentEditTask,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isTaskDialogOpen,
    setIsTaskDialogOpen,
    teamEventDialogOpen,
    setTeamEventDialogOpen,
    droppedCrewId,
    setDroppedCrewId,
    assignmentType,
    setAssignmentType,
    locationType,
    setLocationType,
    formData,
    setFormData,
    resetFormData,
    handleAddTask,
    handleOpenAddTaskDialog,
    handleOpenCrewVisitDialog,
    handleEditTask,
    handleCreateTeamEvent
  } = useTaskDialogs({
    tasks,
    setTasks,
    selectedDate
  });
  
  const {
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useDragDrop({
    tasks,
    setTasks,
    selectedDate,
    setFormData,
    formData,
    setDroppedCrewId,
    setAssignmentType,
    setTeamEventDialogOpen
  });
  
  const {
    handleDownloadTxt,
    handleDownloadPdf
  } = useScheduleDownload(tasks, currentFilter);
  
  // Get filtered tasks
  const filteredTasks = getFilteredTasks(tasks);

  return (
    <div 
      className="p-4 schedule-drop-zone transition-colors duration-300 rounded-lg" 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header with action buttons */}
      <ScheduleHeader
        onDownloadPdf={handleDownloadPdf}
        onDownloadTxt={handleDownloadTxt}
        onAddIndividualTask={() => handleOpenAddTaskDialog('individual')}
        onAddCrewTask={() => handleOpenAddTaskDialog('crew')}
        onAddClientVisit={handleOpenCrewVisitDialog}
      />
      
      {/* Filter bar */}
      <ScheduleFilterBar
        employees={employees}
        crews={crews}
        clients={clients}
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        onDownloadPdf={handleDownloadPdf}
        onDownloadTxt={handleDownloadTxt}
      />
      
      {/* Show a message when filtered schedule is empty */}
      {filteredTasks.length === 0 && currentFilter.type !== 'all' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 dark:text-blue-300 font-medium">No tasks found</h3>
          <p className="text-blue-600 dark:text-blue-400 mt-1">
            There are no tasks scheduled for the selected {currentFilter.type}
            {currentFilter.name ? `: ${currentFilter.name}` : ''}
          </p>
        </div>
      )}
      
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-0">
          <TaskCalendarView
            tasks={filteredTasks}
            selectedDate={selectedDate}
            onSelectDate={(date) => date && setSelectedDate(date)}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            crews={crews}
            onAddNewTask={handleOpenAddTaskDialog}
            onMoveTask={handleMoveTask}
            onEditTask={handleEditTask}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <TaskListView
            tasks={filteredTasks}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            crews={crews}
            clients={clients}
            clientLocations={clientLocations}
            onEditTask={handleEditTask}
          />
        </TabsContent>
      </Tabs>

      {/* Upload and Analyze Section */}
      <div className="mt-8 border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
            <FileUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold">Upload & Analyze Schedule</h2>
        </div>
        
        <UploadAnalyzeSection 
          onApplyScheduleData={handleApplyScheduleData}
          selectedDate={selectedDate}
        />
      </div>

      {/* Scheduling Guide */}
      <ScheduleGuide />

      {/* Team Event Dialog for dropped crews */}
      <TeamEventDialog 
        open={teamEventDialogOpen}
        onOpenChange={setTeamEventDialogOpen}
        onCreateEvent={handleCreateTeamEvent}
        formData={formData}
        setFormData={setFormData}
        assignmentType={assignmentType}
        setAssignmentType={setAssignmentType}
        locationType={locationType}
        setLocationType={setLocationType}
        selectedDate={selectedDate}
        crews={crews}
        employees={employees}
        clients={clients}
        clientLocations={clientLocations}
      />

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {assignmentType === 'individual' 
                ? 'Schedule Employee Task' 
                : locationType === 'client' 
                  ? 'Schedule Crew Client Visit' 
                  : 'Schedule Crew Task'}
            </DialogTitle>
          </DialogHeader>
          <TeamEventDialog 
            open={isTaskDialogOpen}
            onOpenChange={setIsTaskDialogOpen}
            onCreateEvent={handleAddTask}
            formData={formData}
            setFormData={setFormData}
            assignmentType={assignmentType}
            setAssignmentType={setAssignmentType}
            locationType={locationType}
            setLocationType={setLocationType}
            selectedDate={selectedDate}
            crews={crews}
            employees={employees}
            clients={clients}
            clientLocations={clientLocations}
          />
        </DialogContent>
      </Dialog>

      {/* Task Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskEditDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSaveChanges={handleSaveTaskChanges}
            task={currentEditTask}
            crews={crews}
            employees={employees}
            clients={clients}
            clientLocations={clientLocations}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleView;
