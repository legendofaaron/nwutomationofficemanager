
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus } from 'lucide-react';

const mockEmployees = [
  { id: 1, name: 'John Smith', role: 'Software Engineer', department: 'Engineering', status: 'Active' },
  { id: 2, name: 'Sarah Johnson', role: 'Product Manager', department: 'Product', status: 'Active' },
  { id: 3, name: 'Michael Brown', role: 'UX Designer', department: 'Design', status: 'Active' },
];

const EmployeesView = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Employees</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-4 pb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            placeholder="Search employees..." 
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEmployees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {employee.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeesView;
