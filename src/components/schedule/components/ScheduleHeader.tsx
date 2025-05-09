
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Plus, User, Users, Briefcase } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ScheduleHeaderProps {
  onDownloadPdf: () => void;
  onDownloadTxt: () => void;
  onAddIndividualTask: () => void;
  onAddCrewTask: () => void;
  onAddClientVisit: () => void;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  onDownloadPdf,
  onDownloadTxt,
  onAddIndividualTask,
  onAddCrewTask,
  onAddClientVisit
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2 h-6 w-6 text-primary" />
          Schedule Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Plan and manage your team's schedule and client visits
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Export schedule</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDownloadPdf}>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadTxt}>
              Export as Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Add new task</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddIndividualTask} className="gap-2">
              <User className="h-4 w-4" />
              <span>Employee Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddCrewTask} className="gap-2">
              <Users className="h-4 w-4" />
              <span>Crew Task</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onAddClientVisit} className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Client Visit</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ScheduleHeader;
