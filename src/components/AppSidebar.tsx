import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Brain, Building2, Database, File, FileText, Folder, FolderOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const {
    viewMode,
    setViewMode,
    files,
    setCurrentFile,
    databaseTables,
    currentTable,
    setCurrentTable,
    sidebarOpen,
    setSidebarOpen,
    setAiAssistantOpen,
    aiAssistantOpen
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
      isActive: viewMode === 'knowledge'
    },
    {
      title: "AI Assistant",
      icon: FileText,
      onClick: () => setAiAssistantOpen(!aiAssistantOpen),
      isActive: aiAssistantOpen
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
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
                  <SidebarMenuButton
                    onClick={item.onClick}
                    data-active={item.isActive}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
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
    </Sidebar>
  );
};

export const SidebarToggle = () => {
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="fixed top-4 left-4 z-20 h-8 w-8"
    >
      {sidebarOpen ? <X className="h-4 w-4" /> : <File className="h-4 w-4" />}
    </Button>
  );
};

export default AppSidebar;
