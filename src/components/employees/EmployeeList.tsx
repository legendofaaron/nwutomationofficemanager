
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
import { GripHorizontal, Users, Calendar, Download, Trash2 } from 'lucide-react';
import { Employee, Crew, TaskForEmployeeView } from './types';

interface EmployeeListProps {
  employees: Employee[];
  searchTerm: string;
  onHandleEmployeeDragStart: (e: React.DragEvent, employee: Employee) => void;
  onSelectEmployee: (employeeId: string) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string, employeeName: string) => void; 
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onAssignTask: (employeeId: string, employeeName: string) => void; 
  onDownloadSchedule: (employeeId: string) => void;
  getEmployeeCrews: (employeeId: string) => string[];
  getEmployeeTasks: (employeeId: string) => TaskForEmployeeView[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  searchTerm,
  onHandleEmployeeDragStart,
  onSelectEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onDragOver,
  onDrop,
  onAssignTask,
  onDownloadSchedule,
  getEmployeeCrews,
  getEmployeeTasks
}) => {
  const filteredEmployees = searchTerm 
    ? employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.position && emp.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : employees;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Crews</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(employee => (
              <TableRow 
                key={employee.id}
                draggable
                onDragStart={(e) => onHandleEmployeeDragStart(e, employee)}
                className="hover:bg-accent/50 transition-colors cursor-grab"
              >
                <TableCell className="w-10">
                  <GripHorizontal className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{employee.name}</span>
                  </div>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {employee.email && (
                      <div>{employee.email}</div>
                    )}
                    {employee.phone && (
                      <div>{employee.phone}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {employee.crews && employee.crews.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {employee.crews.map(crewId => (
                        <Badge key={crewId} variant="outline" className="text-xs">
                          {getEmployeeCrews(employee.id).find(crew => crew === crewId) || crewId}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No crews</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="Assign to crew"
                      onClick={() => onSelectEmployee(employee.id)}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="Schedule task"
                      onClick={() => onAssignTask(employee.id, employee.name)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="Download schedule"
                      onClick={() => onDownloadSchedule(employee.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      title="Delete employee"
                      onClick={() => onDeleteEmployee(employee.id, employee.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No employees found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeList;
