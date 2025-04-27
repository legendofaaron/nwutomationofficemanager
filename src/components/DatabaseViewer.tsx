
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
        <h2 className="text-lg font-medium">{currentTable.name}</h2>
        <div className="text-sm text-gray-500">
          {currentTable.rows.length} rows
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
