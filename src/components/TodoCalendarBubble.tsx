
// This component serves as a wrapper for TodoCalendar
// It's included in the MainLayout to provide access to the calendar everywhere
import React from 'react';
import TodoCalendar from './TodoCalendar';

const TodoCalendarBubble: React.FC = () => {
  return (
    <TodoCalendar />
  );
};

export default TodoCalendarBubble;
