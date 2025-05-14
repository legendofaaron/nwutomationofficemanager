
import React from 'react';
import TaskCalendarView from './schedule/calendar/TaskCalendarView';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { useAppContext } from '@/context/AppContext';

// This component is a wrapper for TaskCalendarView with necessary props
export default () => {
  // Get tasks from app context
  const { todos } = useAppContext();
  
  // Use the calendar sync hook to get and set dates
  const { date: selectedDate, setDate: setSelectedDate } = useCalendarSync();
  
  // Convert todos to the format expected by TaskCalendarView
  const tasks = todos.map(todo => ({
    id: todo.id,
    title: todo.text,
    description: '',
    date: todo.date || new Date(),
    completed: todo.completed || false,
    startTime: todo.startTime || '09:00',
    endTime: todo.endTime || '10:00',
    crew: todo.crewMembers || [],
    crewId: todo.crewId,
    crewName: todo.crewName,
    location: todo.location
  }));
  
  // Empty handler for toggling task completion
  const handleToggleTaskCompletion = (taskId: string) => {
    // This would normally update the task's completed status
    console.log(`Toggle task completion: ${taskId}`);
  };
  
  // Empty handler for adding a new task
  const handleAddNewTask = () => {
    console.log('Add new task');
  };
  
  return (
    <TaskCalendarView 
      tasks={tasks}
      selectedDate={selectedDate || new Date()}
      onSelectDate={(date) => setSelectedDate(date as Date)}
      onToggleTaskCompletion={handleToggleTaskCompletion}
      crews={[]}
      onAddNewTask={handleAddNewTask}
    />
  );
};
