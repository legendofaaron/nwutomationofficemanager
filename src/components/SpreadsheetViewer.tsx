
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Save, Plus, Download, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FileItem } from '@/components/schedule/ScheduleTypes';

const SpreadsheetViewer = () => {
  const { currentFile, setCurrentFile, files, setFiles, aiAssistantOpen, setAiAssistantOpen } = useAppContext();
  
  // If no spreadsheet is selected
  if (!currentFile || currentFile.type !== 'spreadsheet') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Select a spreadsheet to view or edit</p>
      </div>
    );
  }

  const [spreadsheetData, setSpreadsheetData] = useState<{ headers: string[]; rows: Record<string, any>[] }>(
    currentFile.spreadsheetData || { headers: [], rows: [] }
  );
  
  // Handle cell value change
  const handleCellChange = (rowIndex: number, header: string, value: string) => {
    const newRows = [...spreadsheetData.rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [header]: value };
    
    const newData = {
      ...spreadsheetData,
      rows: newRows
    };
    
    setSpreadsheetData(newData);
    
    // Update the current file
    const updatedFile = {
      ...currentFile,
      spreadsheetData: newData
    };
    
    setCurrentFile(updatedFile);
    
    // Update the file in the files array
    updateFileInFilesArray(updatedFile);
  };
  
  // Add a new row
  const addRow = () => {
    const newRow: Record<string, any> = {};
    spreadsheetData.headers.forEach(header => {
      newRow[header] = '';
    });
    
    const newData = {
      ...spreadsheetData,
      rows: [...spreadsheetData.rows, newRow]
    };
    
    setSpreadsheetData(newData);
    
    // Update the current file
    const updatedFile = {
      ...currentFile,
      spreadsheetData: newData
    };
    
    setCurrentFile(updatedFile);
    
    // Update the file in the files array
    updateFileInFilesArray(updatedFile);
    
    toast({
      title: "Row Added",
      description: "A new row has been added to your spreadsheet"
    });
  };
  
  // Add a new column
  const addColumn = () => {
    // Create a name for the new column
    const columnName = `Column ${spreadsheetData.headers.length + 1}`;
    
    // Add the new header
    const newHeaders = [...spreadsheetData.headers, columnName];
    
    // Add the new column to each row
    const newRows = spreadsheetData.rows.map(row => ({
      ...row,
      [columnName]: ''
    }));
    
    const newData = {
      headers: newHeaders,
      rows: newRows
    };
    
    setSpreadsheetData(newData);
    
    // Update the current file
    const updatedFile = {
      ...currentFile,
      spreadsheetData: newData
    };
    
    setCurrentFile(updatedFile);
    
    // Update the file in the files array
    updateFileInFilesArray(updatedFile);
    
    toast({
      title: "Column Added",
      description: `A new column "${columnName}" has been added to your spreadsheet`
    });
  };
  
  // Helper function to update the file in the files array
  const updateFileInFilesArray = (updatedFile: FileItem) => {
    // Create a deep copy of files
    const updateFiles = (filesArray: FileItem[]): FileItem[] => {
      return filesArray.map(file => {
        if (file.id === updatedFile.id) {
          return updatedFile;
        } else if (file.children) {
          return { ...file, children: updateFiles(file.children) };
        }
        return file;
      });
    };
    
    setFiles(updateFiles(files));
  };
  
  // Export as CSV
  const exportAsCsv = () => {
    if (!spreadsheetData || !spreadsheetData.headers || !spreadsheetData.rows) {
      toast({
        title: "Export Failed",
        description: "No spreadsheet data to export",
        variant: "destructive"
      });
      return;
    }
    
    const headers = spreadsheetData.headers.join(',');
    const rows = spreadsheetData.rows.map(row => {
      return spreadsheetData.headers.map(header => row[header]).join(',');
    }).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${currentFile.name.split('.')[0]}.csv`);
    a.click();
    
    toast({
      title: "Export Successful",
      description: "Your spreadsheet has been exported as CSV"
    });
  };

  // Initialize with default data if spreadsheetData is missing
  useEffect(() => {
    if (!currentFile.spreadsheetData) {
      const defaultData = {
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [{ 'Column 1': '', 'Column 2': '', 'Column 3': '' }]
      };
      
      setSpreadsheetData(defaultData);
      
      // Update the current file with default data
      const updatedFile = {
        ...currentFile,
        spreadsheetData: defaultData
      };
      
      setCurrentFile(updatedFile);
      updateFileInFilesArray(updatedFile);
    }
  }, [currentFile]);
  
  return (
    <div className="relative h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">{currentFile.name}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={exportAsCsv}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={addColumn}>
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
          <Button variant="ghost" size="icon">
            <Save className="h-4 w-4" />
          </Button>
          <Button 
            variant={aiAssistantOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <Table className="border">
          <TableHeader>
            <TableRow>
              {spreadsheetData.headers.map((header, index) => (
                <TableHead key={index} className="font-bold border bg-gray-100">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {spreadsheetData.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {spreadsheetData.headers.map((header, cellIndex) => (
                  <TableCell key={`${rowIndex}-${cellIndex}`} className="p-0 border">
                    <Input
                      value={row[header] || ''}
                      onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      className="border-0 h-full focus:ring-0 focus:ring-offset-0"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4">
          <Button variant="outline" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetViewer;
