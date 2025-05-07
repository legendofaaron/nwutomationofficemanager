
import React, { memo } from 'react';
import { Task, Crew } from '../ScheduleTypes';
import EmptyTaskList from './EmptyTaskList';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  crews: Crew[];
  onToggleTaskCompletion: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onAddNewTask: () => void;
  onDragStart: (data: any, event: React.DragEvent) => void;
  onDragEnd: () => void;
}

const TaskList = memo(({
  tasks,
  crews,
  onToggleTaskCompletion,
  onEditTask,
  onAddNewTask,
  onDragStart,
  onDragEnd
}: TaskListProps) => {
  if (tasks.length === 0) {
    return <EmptyTaskList onAddNewTask={onAddNewTask} />;
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          crews={crews}
          onToggleTaskCompletion={onToggleTaskCompletion}
          onEditTask={onEditTask}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  if (prevProps.tasks.length !== nextProps.tasks.length) {
    return false;
  }
  
  // Check for changes in completion status
  for (let i = 0; i < prevProps.tasks.length; i++) {
    if (
      prevProps.tasks[i].id !== nextProps.tasks[i].id ||
      prevProps.tasks[i].completed !== nextProps.tasks[i].completed ||
      prevProps.tasks[i].title !== nextProps.tasks[i].title
    ) {
      return false;
    }
  }
  
  return true;
});

TaskList.displayName = 'TaskList';

export default TaskList;
