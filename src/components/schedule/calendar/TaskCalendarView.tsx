
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useDragDrop } from './DragDropContext';
import { Task, Crew } from './ScheduleTypes';
import { toast } from 'sonner';
import CalendarCard from './calendar/CalendarCard';
import TaskDetailsCard from './calendar/TaskDetailsCard';

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
  // State management
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const { 
    isDragging, setIsDragging, 
    draggedItemId, setDraggedItemId, 
    draggedItemType, setDraggedItemType, 
    draggedItemData, setDraggedItemData 
  } = useDragDrop();

  // Effect to update currentMonth when selectedDate changes significantly
  useEffect(() => {
    if (selectedDate && (selectedDate.getMonth() !== currentMonth.getMonth() || 
                         selectedDate.getFullYear() !== currentMonth.getFullYear())) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate, currentMonth]);

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => 
    task.date.toDateString() === selectedDate.toDateString()
  );

  // Count tasks by status
  const completedTasks = tasksForSelectedDate.filter(task => task.completed).length;
  const pendingTasks = tasksForSelectedDate.length - completedTasks;

  // Handle task drag start
  const handleDragStart = (data: any, event: React.DragEvent) => {
    setIsDragging(true);
    setDraggedItemId(data.id);
    setDraggedItemType('task');
    setDraggedItemData(data);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItemId(null);
    setDraggedItemType(null);
    setDraggedItemData(null);
  };

  // Handle dropping a task on a day
  const handleDayDrop = (data: any, event: React.DragEvent, date: Date) => {
    if (data.type === 'task' && onMoveTask) {
      onMoveTask(data.id, date);
      toast.success(`Task rescheduled to ${format(date, 'MMMM d')}`, {
        description: data.title
      });
    }
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
    onMonthChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
    onMonthChange(nextMonth);
  };

  // Handle month change from calendar component
  const onMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <CalendarCard 
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        currentMonth={currentMonth}
        onMonthChange={onMonthChange}
        handlePreviousMonth={handlePreviousMonth}
        handleNextMonth={handleNextMonth}
        tasks={tasks}
        handleDayDrop={handleDayDrop}
      />
      
      <TaskDetailsCard 
        selectedDate={selectedDate}
        tasksForSelectedDate={tasksForSelectedDate}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        onToggleTaskCompletion={onToggleTaskCompletion}
        onAddNewTask={onAddNewTask}
        onEditTask={onEditTask}
        crews={crews}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default TaskCalendarView;
