
import { useState } from 'react';
import { Task, ScheduleFilter, FilterType } from '../ScheduleTypes';

export const useScheduleFiltering = () => {
  // Initialize schedule filter state
  const [currentFilter, setCurrentFilter] = useState<ScheduleFilter>({
    type: 'all'
  });

  // Get filtered tasks based on current filter
  const getFilteredTasks = (tasks: Task[]): Task[] => {
    if (currentFilter.type === 'all') {
      return tasks;
    }
    
    if (currentFilter.type === 'employee' && currentFilter.name) {
      return tasks.filter(task => 
        task.assignedTo === currentFilter.name || 
        (task.crew && task.crew.includes(currentFilter.name || ''))
      );
    }
    
    if (currentFilter.type === 'crew' && currentFilter.id) {
      return tasks.filter(task => task.crewId === currentFilter.id);
    }
    
    if (currentFilter.type === 'client' && currentFilter.id) {
      return tasks.filter(task => task.clientId === currentFilter.id);
    }
    
    return tasks;
  };

  // Handle filter change
  const handleFilterChange = (filter: ScheduleFilter) => {
    setCurrentFilter(filter);
  };

  return {
    currentFilter,
    setCurrentFilter,
    getFilteredTasks,
    handleFilterChange
  };
};
