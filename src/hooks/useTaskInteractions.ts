
import { useCallback } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Task } from '@/components/schedule/ScheduleTypes';

/**
 * Custom hook for task interaction functionality 
 * 
 * Provides memoized callbacks for common task operations
 * like toggling completion, moving tasks, and finding tasks
 */
export function useTaskInteractions(
  tasks: Task[],
  onToggleTaskCompletion?: (taskId: string) => void,
  onMoveTask?: (taskId: string, newDate: Date) => void
) {
  /**
   * Find a task by ID
   */
  const findTask = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  /**
   * Handle toggling task completion with toast notification
   */
  const handleToggleTaskCompletion = useCallback((taskId: string) => {
    if (onToggleTaskCompletion) {
      const task = findTask(taskId);
      if (task) {
        onToggleTaskCompletion(taskId);
        
        // Show notification
        const newStatus = !task.completed;
        toast[newStatus ? 'success' : 'info'](
          `Task ${newStatus ? 'completed' : 'reopened'}`,
          {
            description: task.title
          }
        );
      }
    }
  }, [onToggleTaskCompletion, findTask]);

  /**
   * Handle moving a task to a new date with toast notification
   */
  const handleMoveTask = useCallback((taskId: string, date: Date) => {
    if (onMoveTask) {
      const task = findTask(taskId);
      if (task) {
        onMoveTask(taskId, date);
        
        // Show notification 
        toast.success(`Task rescheduled to ${format(date, 'MMMM d')}`, {
          description: task.title
        });
      }
    }
  }, [onMoveTask, findTask]);

  return {
    findTask,
    handleToggleTaskCompletion,
    handleMoveTask
  };
}
