import React from 'react';
import { useAppContext } from '@/context/AppContext';
import NewDocumentDialog from './NewDocumentDialog';
import { 
  Brain, 
  Building2, 
  Database, 
  File, 
  FileText, 
  Folder, 
  FolderOpen, 
  Menu, 
  Table, 
  X,
  FilePlus,
  FolderPlus,
  Plus,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
    setFiles,
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

  const createNewItem = (type: 'document' | 'spreadsheet' | 'folder') => {
    const newId = `new-${Date.now()}`;
    const newName = type === 'folder' ? 'New Folder' : type === 'spreadsheet' ? 'New Spreadsheet' : 'New Document';
    const newFile = {
      id: newId,
      name: newName,
      type: type,
      content: type === 'document' ? '# New Document\n\nStart writing here...' : undefined,
      spreadsheetData: type === 'spreadsheet' ? {
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [
          { 'Column 1': '', 'Column 2': '', 'Column 3': '' },
          { 'Column 1': '', 'Column 2': '', 'Column 3': '' }
        ]
      } : undefined
    };
    setFiles([...files, newFile]);
    setCurrentFile(newFile);
    setViewMode(type === 'spreadsheet' ? 'spreadsheet' : type === 'document' ? 'document' : 'files');
  };

  const renderFileTree = (files: any[], level = 0) => {
    return files.map(file => (
      <SidebarMenuItem key={file.id}>
        {file.type === 'folder' ? (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center w-full text-left p-2 hover:bg-sidebar-accent rounded-md">
              {file.children && file.children.length > 0 ? (
                <>
                  <ChevronRight className="w-4 h-4 mr-2 transition-transform duration-200 transform group-data-[state=open]:rotate-90" />
                  <FolderOpen className="w-4 h-4 mr-2" />
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  <Folder className="w-4 h-4 mr-2" />
                </>
              )}
              <span>{file.name}</span>
            </CollapsibleTrigger>
            {file.children && (
              <CollapsibleContent className="ml-4">
                {renderFileTree(file.children, level + 1)}
              </CollapsibleContent>
            )}
          </Collapsible>
        ) : (
          <SidebarMenuButton
            onClick={() => handleFileClick(file)}
            className="w-full text-left"
          >
            {file.type === 'spreadsheet' ? (
              <Table className="w-4 h-4 mr-2" />
            ) : (
              <File className="w-4 h-4 mr-2" />
            )}
            <span>{file.name}</span>
          </SidebarMenuButton>
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
          <SidebarGroupLabel>Create New</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NewDocumentDialog />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => createNewItem('spreadsheet')}>
                  <Plus className="w-4 h-4 mr-2" />
                  <span>New Spreadsheet</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => createNewItem('folder')}>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  <span>New Folder</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
    </>
  );
};

export const SidebarToggle = () => {
  const { setSidebarOpen } = useAppContext();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setSidebarOpen(true)}
      className="fixed top-4 left-4 z-20 h-8 w-8 bg-white shadow-sm"
    >
      <Menu className="h-4 w-4" />
    </Button>
  );
};

export default AppSidebar;
