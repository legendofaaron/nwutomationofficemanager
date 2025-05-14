
import React from 'react';
import { ScheduleFilter } from '@/components/schedule/ScheduleTypes';
import ScheduleFilterBar from '@/components/schedule/ScheduleFilterBar';

interface ScheduleHeaderProps {
  employees: any[];
  crews: any[];
  clients: any[];
  currentFilter: ScheduleFilter;
  onFilterChange: (filter: ScheduleFilter) => void;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  employees,
  crews,
  clients,
  currentFilter,
  onFilterChange
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
      
      <ScheduleFilterBar 
        employees={employees}
        crews={crews}
        clients={clients}
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};

export default ScheduleHeader;
