
import React, { memo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarNavigationHeaderProps {
  currentMonth: Date;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  onToday?: () => void;
}

const CalendarNavigationHeader = memo(({
  currentMonth,
  handlePreviousMonth,
  handleNextMonth,
  onToday
}: CalendarNavigationHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      </div>
      <div className="flex items-center space-x-1.5">
        {onToday && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3"
            onClick={onToday}
          >
            Today
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

CalendarNavigationHeader.displayName = 'CalendarNavigationHeader';

export default CalendarNavigationHeader;
