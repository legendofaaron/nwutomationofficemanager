
import React, { useCallback, memo } from 'react';
import { DragDropProvider } from './DragDropContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Task, Crew } from './ScheduleTypes';

// Import our refactored components
import TaskCalendarView from './calendar/TaskCalendarView';

interface TaskCalendarViewWrapperProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | null) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  crews: Crew[];
  onAddNewTask: (type?: string) => void;
  onMoveTask?: (taskId: string, date: Date) => void;
}

// This is a simple wrapper component that provides drag and drop context
// and delegates rendering to the actual TaskCalendarView component
const TaskCalendarViewWrapper: React.FC<TaskCalendarViewWrapperProps> = memo(({
  tasks,
  selectedDate,
  onSelectDate,
  onToggleTaskCompletion,
  onEditTask,
  crews,
  onAddNewTask,
  onMoveTask
}) => {
  // Handler for moving tasks between dates
  const handleMoveTask = useCallback((taskId: string, date: Date) => {
    if (onMoveTask) {
      onMoveTask(taskId, date);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        toast.success(`Task rescheduled to ${format(date, 'MMMM d')}`, {
          description: task.title
        });
      }
    }
  }, [onMoveTask, tasks]);

  return (
    <DragDropProvider>
      <TaskCalendarView
        tasks={tasks}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        onToggleTaskCompletion={onToggleTaskCompletion}
        onEditTask={onEditTask}
        crews={crews}
        onAddNewTask={onAddNewTask}
        onMoveTask={handleMoveTask}
      />
    </DragDropProvider>
  );
});

TaskCalendarViewWrapper.displayName = 'TaskCalendarViewWrapper';

export default TaskCalendarViewWrapper;
