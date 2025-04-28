import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Brain, Building2, Database, File, FileText, Folder, FolderOpen, Menu, Table, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import {
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const {
    viewMode,
    setViewMode,
    files,
    setCurrentFile,
    databaseTables,
    setCurrentTable,
    currentTable,
    sidebarOpen,
    setSidebarOpen,
    setAiAssistantOpen,
    aiAssistantOpen
  } = useAppContext();

  const handleFileClick = (file: any) => {
    if (file.type === 'folder') return;
    
    setCurrentFile(file);
    if (file.type === 'spreadsheet') {
      setViewMode('spreadsheet');
    } else {
      setViewMode('document');
    }
  };

  const handleTableClick = (table: any) => {
    setCurrentTable(table);
    setViewMode('database');
  };

  const renderFileTree = (files: any[], level = 0) => {
    return files.map(file => (
      <SidebarMenuItem key={file.id}>
        <SidebarMenuButton
          onClick={() => handleFileClick(file)}
          className="w-full text-left"
        >
          {file.type === 'folder' ? (
            file.children && file.children.length > 0 ? (
              <FolderOpen className="w-4 h-4 mr-2" />
            ) : (
              <Folder className="w-4 h-4 mr-2" />
            )
          ) : file.type === 'spreadsheet' ? (
            <Table className="w-4 h-4 mr-2" />
          ) : (
            <File className="w-4 h-4 mr-2" />
          )}
          <span>{file.name}</span>
        </SidebarMenuButton>
        {file.type === 'folder' && file.children && (
          <div className="ml-4">
            {renderFileTree(file.children, level + 1)}
          </div>
        )}
      </SidebarMenuItem>
    ));
  };

  const mainMenuItems = [
    {
      title: "Office Manager",
      icon: Building2,
      onClick: () => setViewMode('office'),
      isActive: viewMode === 'office'
    },
    {
      title: "Knowledge Base",
      icon: Brain,
      onClick: () => setViewMode('knowledge'),
      isActive: viewMode === 'knowledge',
      showTrigger: true
    },
    {
      title: "AI Assistant",
      icon: FileText,
      onClick: () => setAiAssistantOpen(!aiAssistantOpen),
      isActive: aiAssistantOpen
    }
  ];

  return (
    <>
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center justify-between">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="h-6 w-6 hover:bg-app-gray-light"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="relative">
                    <SidebarMenuButton
                      onClick={item.onClick}
                      data-active={item.isActive}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    
                    {item.showTrigger && (
                      <SidebarTrigger className="absolute -right-12 top-0 z-20 h-10 w-12 bg-white shadow-md rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <div className="scale-75">
                          <Logo />
                        </div>
                      </SidebarTrigger>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderFileTree(files)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Database</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {databaseTables.map(table => (
                <SidebarMenuItem key={table.id}>
                  <SidebarMenuButton
                    onClick={() => handleTableClick(table)}
                    data-active={viewMode === 'database' && table.id === currentTable?.id}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    <span>{table.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
};

export default AppSidebar;
