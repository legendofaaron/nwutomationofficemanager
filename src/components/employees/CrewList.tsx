
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GripHorizontal, Users, Cog, ListCheck, Download } from 'lucide-react';
import { Employee, Crew } from './types';

interface CrewListProps {
  crews: Crew[];
  searchTerm: string;
  onHandleCrewDragStart: (e: React.DragEvent, crew: Crew) => void;
  onSelectCrew: (crewId: string) => void;
  onManageCrew: (crewId: string) => void;
  onAssignTask: (crewId: string, crewName: string) => void;
  onDownloadSchedule: (crewId: string) => void;
  getCrewTasks: (crewId: string) => any[];
  getEmployeeNameById: (employeeId: string) => string;
}

const CrewList: React.FC<CrewListProps> = ({
  crews,
  searchTerm,
  onHandleCrewDragStart,
  onSelectCrew,
  onManageCrew,
  onAssignTask,
  onDownloadSchedule,
  getCrewTasks,
  getEmployeeNameById
}) => {
  const filteredCrews = searchTerm
    ? crews.filter(crew => 
        crew.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : crews;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Crew Name</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Active Tasks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCrews.length > 0 ? (
            filteredCrews.map(crew => (
              <TableRow 
                key={crew.id}
                draggable
                onDragStart={(e) => onHandleCrewDragStart(e, crew)}
                className="hover:bg-accent/50 transition-colors cursor-grab"
              >
                <TableCell className="w-10">
                  <GripHorizontal className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {crew.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {crew.members.length > 0 ? (
                      <div className="flex -space-x-2">
                        {crew.members.slice(0, 3).map((memberId, index) => (
                          <Avatar key={memberId} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="text-xs">
                              {getEmployeeNameById(memberId).substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {crew.members.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs">
                            +{crew.members.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No members</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getCrewTasks(crew.id).length > 0 ? (
                    <Badge variant="secondary">
                      {getCrewTasks(crew.id).length} {getCrewTasks(crew.id).length === 1 ? 'task' : 'tasks'}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">No tasks</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="Manage members"
                      onClick={() => onManageCrew(crew.id)}
                    >
                      <Cog className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="Assign task to crew"
                      onClick={() => onAssignTask(crew.id, crew.name)}
                    >
                      <ListCheck className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="Download crew schedule"
                      onClick={() => onDownloadSchedule(crew.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No crews found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CrewList;
