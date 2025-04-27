
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Calendar, Receipt, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const DatabaseViewer = () => {
  const { currentTable } = useAppContext();

  if (!currentTable) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Select a database table to view</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-app-blue" />
          <h2 className="text-lg font-medium">{currentTable.name}</h2>
          <span className="text-sm text-gray-500 ml-2">
            {currentTable.rows.length} rows
          </span>
        </div>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Employees
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Receipt className="h-4 w-4" />
            Invoices
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="p-4 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {currentTable.columns.map(column => (
                <TableHead key={column.name} className="font-medium">
                  {column.name}
                  <span className="text-xs text-gray-400 ml-1">({column.type})</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTable.rows.map((row, index) => (
              <TableRow key={index}>
                {currentTable.columns.map(column => (
                  <TableCell key={column.name}>
                    {row[column.name] !== undefined ? String(row[column.name]) : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DatabaseViewer;
