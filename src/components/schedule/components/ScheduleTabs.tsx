
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Users, User, Building2 } from 'lucide-react';
import { ScheduleFilter } from '@/components/schedule/ScheduleTypes';
import TaskCalendarView from '@/components/schedule/calendar/TaskCalendarView';
import TaskListView from '@/components/schedule/TaskListView';

interface ScheduleTabsProps {
  viewMode: 'calendar' | 'list';
  onViewModeChange: (value: 'calendar' | 'list') => void;
  filteredTasks: any[];
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  crews: any[];
  clients: any[];
  clientLocations: any[];
  activeFilter: ScheduleFilter;
  onAddNewTask: () => void;
  onMoveTask: (taskId: string, newDate: Date) => void;
}

const ScheduleTabs: React.FC<ScheduleTabsProps> = React.memo(({
  viewMode,
  onViewModeChange,
  filteredTasks,
  selectedDate,
  onSelectDate,
  onToggleTaskCompletion,
  onEditTask,
  crews,
  clients,
  clientLocations,
  activeFilter,
  onAddNewTask,
  onMoveTask
}) => {
  // Filter icon based on active filter type
  const FilterIcon = React.useMemo(() => {
    if (activeFilter.type === 'employee') return User;
    if (activeFilter.type === 'crew') return Users;
    if (activeFilter.type === 'client') return Building2;
    return null;
  }, [activeFilter.type]);

  return (
    <Tabs value={viewMode} onValueChange={(v) => onViewModeChange(v as 'calendar' | 'list')} className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>
        
        <div className="text-sm text-muted-foreground">
          {activeFilter.type !== 'all' && FilterIcon && (
            <span className="flex items-center gap-1.5">
              <FilterIcon className="h-3.5 w-3.5" />
              Filtered by {activeFilter.type}: {activeFilter.name}
            </span>
          )}
        </div>
      </div>
      
      <TabsContent value="calendar" className="m-0">
        <TaskCalendarView 
          tasks={filteredTasks}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onToggleTaskCompletion={onToggleTaskCompletion}
          crews={crews}
          onAddNewTask={onAddNewTask}
          onMoveTask={onMoveTask}
          onEditTask={onEditTask}
        />
      </TabsContent>
      
      <TabsContent value="list" className="m-0">
        <TaskListView 
          tasks={filteredTasks}
          onToggleTaskCompletion={onToggleTaskCompletion}
          onEditTask={onEditTask}
          crews={crews}
          clients={clients}
          clientLocations={clientLocations}
        />
      </TabsContent>
    </Tabs>
  );
});

ScheduleTabs.displayName = 'ScheduleTabs';

export default ScheduleTabs;
