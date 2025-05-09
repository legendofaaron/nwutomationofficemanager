
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Briefcase, Users, ArrowRight, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ScheduleGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mt-8 border border-border rounded-lg p-4 bg-card/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="font-semibold">Schedule Help Guide</h2>
        </div>
        
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle guide</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="border rounded-md p-4 bg-background">
            <div className="flex items-center mb-3">
              <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 mr-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium">Calendar Management</h3>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>Click on any date to select it</li>
              <li>Double-click to add a new task</li>
              <li>Drag tasks to reschedule them</li>
              <li>Toggle between calendar and list views</li>
            </ul>
          </div>
          
          <div className="border rounded-md p-4 bg-background">
            <div className="flex items-center mb-3">
              <div className="p-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 mr-2">
                <Briefcase className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-medium">Client Visits</h3>
            </div>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                <ArrowRight className="h-3 w-3" />
                <Calendar className="h-3 w-3" />
                <span>Drag clients to schedule visits</span>
              </p>
              <p>Or use the "Add Client Visit" button in the menu</p>
              <p>Assign crews to client visits for team coordination</p>
            </div>
          </div>
          
          <div className="border rounded-md p-4 bg-background">
            <div className="flex items-center mb-3">
              <div className="p-1.5 rounded-full bg-green-50 dark:bg-green-900/20 mr-2">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium">Team Assignment</h3>
            </div>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>Assign tasks to individual employees or crews</p>
              <p>Filter schedule by employee or crew</p>
              <p className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <ArrowRight className="h-3 w-3" />
                <Calendar className="h-3 w-3" />
                <span>Drag employees/crews to schedule</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Pro tip: Use the filter bar to view schedules for specific employees, crews, or clients.</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ScheduleGuide;
