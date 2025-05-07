
import React, { memo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Task, Crew } from '../ScheduleTypes';
import TaskListHeader from './TaskListHeader';
import TaskList from './TaskList';

interface TaskDetailsCardProps {
  selectedDate: Date;
  tasksForSelectedDate: Task[];
  completedTasks: number;
  pendingTasks: number;
  onToggleTaskCompletion: (taskId: string) => void;
  onAddNewTask: () => void;
  onEditTask?: (taskId: string) => void;
  crews: Crew[];
  onDragStart: (data: any, event: React.DragEvent) => void;
  onDragEnd: () => void;
}

const TaskDetailsCard = memo(({
  selectedDate,
  tasksForSelectedDate,
  completedTasks,
  pendingTasks,
  onToggleTaskCompletion,
  onAddNewTask,
  onEditTask,
  crews,
  onDragStart,
  onDragEnd
}: TaskDetailsCardProps) => {
  return (
    <Card className="shadow-md border rounded-xl overflow-hidden">
      <CardHeader className="bg-card border-b p-5 space-y-0">
        <TaskListHeader 
          selectedDate={selectedDate}
          onAddNewTask={onAddNewTask}
          pendingTasks={pendingTasks}
          completedTasks={completedTasks}
        />
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
          <TaskList 
            tasks={tasksForSelectedDate}
            crews={crews}
            onToggleTaskCompletion={onToggleTaskCompletion}
            onEditTask={onEditTask}
            onAddNewTask={onAddNewTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        </div>
      </CardContent>
    </Card>
  );
});

TaskDetailsCard.displayName = 'TaskDetailsCard';

export default TaskDetailsCard;
