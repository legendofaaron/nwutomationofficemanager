import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { ChevronLeft, ChevronRight, Database, File, Folder, FolderOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

const AppSidebar = () => {
  const {
    viewMode,
    setViewMode,
    files,
    setCurrentFile,
    databaseTables,
    setCurrentTable,
    sidebarOpen,
    setSidebarOpen
  } = useAppContext();

  const handleFileClick = (file: any) => {
    if (file.type !== 'folder') {
      setCurrentFile(file);
      setViewMode('document');
    }
  };

  const handleTableClick = (table: any) => {
    setCurrentTable(table);
    setViewMode('database');
  };

  const renderFileTree = (files: any[], level = 0) => {
    return files.map(file => (
      <div key={file.id} className="ml-4">
        <button
          onClick={() => handleFileClick(file)}
          className={cn(
            "flex items-center py-1 px-2 w-full text-left rounded hover:bg-app-gray-light transition-colors",
            file.type !== 'folder' && "text-sm"
          )}
        >
          {file.type === 'folder' ? (
            file.children && file.children.length > 0 ? (
              <FolderOpen className="w-4 h-4 mr-2 text-app-blue" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-app-blue" />
            )
          ) : (
            <File className="w-4 h-4 mr-2 text-app-blue" />
          )}
          <span>{file.name}</span>
        </button>
        {file.type === 'folder' && file.children && renderFileTree(file.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-10",
      sidebarOpen ? "w-64" : "w-0 overflow-hidden"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-app-blue">
        <Logo />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="h-6 w-6 text-white hover:bg-app-blue-dark"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-60px)]">
        <div className="p-3">
          <h3 className="text-xs font-medium uppercase text-gray-500 tracking-wider mb-2">Files</h3>
          {renderFileTree(files)}
        </div>

        <div className="p-3 border-t border-gray-200">
          <h3 className="text-xs font-medium uppercase text-gray-500 tracking-wider mb-2">Database</h3>
          <div>
            {databaseTables.map(table => (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className="flex items-center py-1 px-2 w-full text-left rounded hover:bg-app-gray-light transition-colors text-sm"
              >
                <Database className="w-4 h-4 mr-2 text-app-blue" />
                <span>{table.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SidebarToggle = () => {
  const {
    sidebarOpen,
    setSidebarOpen
  } = useAppContext();
  return <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-4 left-4 z-20 h-8 w-8">
      {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>;
};

export default AppSidebar;
