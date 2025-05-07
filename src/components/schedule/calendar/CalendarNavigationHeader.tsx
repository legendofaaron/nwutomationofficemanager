
import React, { memo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { formatMonthAndYear } from '@/components/calendar/CalendarUtils';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface CalendarNavigationHeaderProps {
  currentMonth: Date;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
}

const CalendarNavigationHeader = memo(({
  currentMonth,
  handlePreviousMonth,
  handleNextMonth
}: CalendarNavigationHeaderProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <div className="flex items-center justify-center p-1.5 rounded-md bg-primary/10 dark:bg-primary/20">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          Schedule Calendar
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousMonth}
            className="h-7 w-7 p-0"
            type="button"
          >
            ←
          </Button>
          <span className="text-sm font-medium">
            {formatMonthAndYear(currentMonth)}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextMonth}
            className="h-7 w-7 p-0"
            type="button"
          >
            →
          </Button>
        </div>
      </div>
      <CardDescription className="text-sm text-muted-foreground">
        Drag tasks to reschedule or select a date to view details
      </CardDescription>
    </div>
  );
});

CalendarNavigationHeader.displayName = 'CalendarNavigationHeader';

export default CalendarNavigationHeader;
