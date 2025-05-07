
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, FileText, Filter } from 'lucide-react';
import { Employee, Crew, Client, FilterType, ScheduleFilter } from './ScheduleTypes';

interface ScheduleFilterBarProps {
  employees: Employee[];
  crews: Crew[];
  clients: Client[];
  currentFilter: ScheduleFilter;
  onFilterChange: (filter: ScheduleFilter) => void;
}

const ScheduleFilterBar: React.FC<ScheduleFilterBarProps> = ({
  employees,
  crews,
  clients,
  currentFilter,
  onFilterChange
}) => {
  // Handle filter type change
  const handleFilterTypeChange = (value: FilterType) => {
    onFilterChange({
      type: value,
      id: undefined,
      name: undefined
    });
  };

  // Handle selection change for employees, crews, or clients
  const handleEntityChange = (value: string) => {
    let name = '';
    
    if (currentFilter.type === 'employee') {
      const employee = employees.find(e => e.id === value);
      name = employee?.name || '';
    } else if (currentFilter.type === 'crew') {
      const crew = crews.find(c => c.id === value);
      name = crew?.name || '';
    } else if (currentFilter.type === 'client') {
      const client = clients.find(c => c.id === value);
      name = client?.name || '';
    }
    
    onFilterChange({
      ...currentFilter,
      id: value,
      name
    });
  };

  // Dummy functions for download buttons - can be implemented later
  const handleDownloadPdf = () => {
    console.log('Download PDF');
  };

  const handleDownloadTxt = () => {
    console.log('Download TXT');
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <Tabs 
          value={currentFilter.type} 
          onValueChange={(value) => handleFilterTypeChange(value as FilterType)}
          className="mr-2"
        >
          <TabsList>
            <TabsTrigger value="all">All Schedules</TabsTrigger>
            <TabsTrigger value="employee">By Employee</TabsTrigger>
            <TabsTrigger value="crew">By Crew</TabsTrigger>
            <TabsTrigger value="client">By Client</TabsTrigger>
          </TabsList>
        </Tabs>

        {currentFilter.type !== 'all' && (
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
            <Select
              value={currentFilter.id || ''}
              onValueChange={handleEntityChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={`Select ${currentFilter.type}`} />
              </SelectTrigger>
              <SelectContent>
                {currentFilter.type === 'employee' && employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
                {currentFilter.type === 'crew' && crews.map(crew => (
                  <SelectItem key={crew.id} value={crew.id}>
                    {crew.name}
                  </SelectItem>
                ))}
                {currentFilter.type === 'client' && clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-2 h-9 font-medium"
          onClick={handleDownloadPdf}
        >
          <FileDown className="h-4 w-4" />
          PDF
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 h-9 font-medium"
          onClick={handleDownloadTxt}
        >
          <FileText className="h-4 w-4" />
          TXT
        </Button>
      </div>
    </div>
  );
};

export default ScheduleFilterBar;
