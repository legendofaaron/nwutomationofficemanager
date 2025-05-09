
import React from 'react';
import { Task, Crew, DragItem } from '../ScheduleTypes';
import { toast } from 'sonner';
import { format } from 'date-fns';
import CalendarCard from './CalendarCard';
import TasksCard from './TasksCard';

interface TaskCalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  crews: Crew[];
  onAddNewTask: () => void;
  onMoveTask?: (taskId: string, newDate: Date) => void;
  onEditTask?: (taskId: string) => void;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onToggleTaskCompletion,
  crews,
  onAddNewTask,
  onMoveTask,
  onEditTask
}) => {
  // Handle moving a task to a new date with toast notification
  const handleMoveTask = (taskId: string, date: Date) => {
    if (onMoveTask) {
      // Find the task to get its title
      const task = tasks.find(t => t.id === taskId);
      const taskTitle = task?.title || 'Task';
      
      // Move the task
      onMoveTask(taskId, date);
      
      // Show success message
      toast.success(`Task rescheduled to ${format(date, 'MMMM d')}`, {
        description: taskTitle
      });
    }
  };

  // Handle dropping other item types (employee, crew, client)
  const handleItemDrop = (item: DragItem, date: Date) => {
    if (item.type === 'employee') {
      toast.info(`Employee dropped on ${format(date, 'MMMM d')}`, {
        description: `${item.data.name || 'Employee'} - Create a new task for them?`
      });
      // You might want to open a task creation dialog pre-filled with this employee
    } else if (item.type === 'crew') {
      toast.info(`Crew dropped on ${format(date, 'MMMM d')}`, {
        description: `${item.data.name || 'Crew'} - Create a new task for this crew?`
      });
      // You might want to open a task creation dialog pre-filled with this crew
    } else if (item.type === 'client') {
      toast.info(`Client dropped on ${format(date, 'MMMM d')}`, {
        description: `${item.data.name || 'Client'} - Create a new task for this client?`
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <CalendarCard 
        tasks={tasks}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        onMoveTask={handleMoveTask}
      />
      
      <TasksCard
        tasks={tasks}
        selectedDate={selectedDate}
        onToggleTaskCompletion={onToggleTaskCompletion}
        crews={crews}
        onAddNewTask={onAddNewTask}
        onEditTask={onEditTask}
      />
    </div>
  );
};

export default TaskCalendarView;
