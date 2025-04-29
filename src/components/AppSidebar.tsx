
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import NewDocumentDialog from './NewDocumentDialog';
import NewFolderDialog from './NewFolderDialog';
import RenameItemDialog from './RenameItemDialog';
import { FilePen, Brain, Building2, Database, File, FileText, Trash2, Folder, FolderOpen, Menu, Table, X, ChevronRight, ChevronDown, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Logo } from './Logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from '@/hooks/use-toast';

const AppSidebar = () => {
  const {
    viewMode,
    setViewMode,
    files,
    setFiles,
    currentFile: activeFile,
    setCurrentFile,
    databaseTables,
    setCurrentTable,
    currentTable,
    sidebarOpen,
    setSidebarOpen,
    setAiAssistantOpen,
    aiAssistantOpen
  } = useAppContext();
  
  const { toast } = useToast();
  
  const [renameItem, setRenameItem] = useState<{ id: string; name: string; type: string } | null>(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  const handleFileClick = (file: any) => {
    if (file.type === 'folder') return;
    setCurrentFile(file);
    if (file.type === 'spreadsheet') {
      setViewMode('spreadsheet');
    } else {
      setViewMode('document');
    }
  };

  const handleRenameClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setRenameItem(item);
    setIsRenameDialogOpen(true);
  };

  const handleEditFile = (e: React.MouseEvent, file: any) => {
    e.stopPropagation();
    setCurrentFile(file);
    if (file.type === 'spreadsheet') {
      setViewMode('spreadsheet');
    } else {
      setViewMode('document');
    }
    toast({
      title: "Edit mode",
      description: `Editing ${file.name}`
    });
  };

  const handleDeleteFile = (e: React.MouseEvent, fileToDelete: any) => {
    e.stopPropagation();
    const deleteFileRecursively = (files: any[], targetId: string): any[] => {
      return files.filter(file => {
        if (file.id === targetId) {
          return false;
        }
        if (file.children) {
          file.children = deleteFileRecursively(file.children, targetId);
        }
        return true;
      });
    };
    
    const updatedFiles = deleteFileRecursively(files, fileToDelete.id);
    setFiles(updatedFiles);
    if (fileToDelete.id === activeFile?.id) {
      setCurrentFile(null);
      setViewMode('files');
    }
    
    toast({
      title: "Item deleted",
      description: `${fileToDelete.name} has been deleted`
    });
  };
  
  const handleTableClick = (table: any) => {
    setCurrentTable(table);
    setViewMode('database');
  };

  const handleCloseRenameDialog = () => {
    setIsRenameDialogOpen(false);
    setRenameItem(null);
  };
  
  const renderFileTree = (files: any[], level = 0) => {
    return files.map(file => <SidebarMenuItem key={file.id}>
        {file.type === 'folder' ? <Collapsible>
            <CollapsibleTrigger className="flex items-center w-full text-left p-2 hover:bg-sidebar-accent rounded-md group/menu-item relative">
              {file.children && file.children.length > 0 ? <>
                  <ChevronRight className="w-4 h-4 mr-2 transition-transform duration-200 transform group-data-[state=open]:rotate-90" />
                  <FolderOpen className="w-4 h-4 mr-2" />
                </> : <>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  <Folder className="w-4 h-4 mr-2" />
                </>}
              <span>{file.name}</span>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/menu-item:opacity-100 transition-opacity">
                <SidebarMenuAction onClick={e => handleRenameClick(e, file)} className="-mt-[0.4cm]" showOnHover>
                  <FilePen className="w-4 h-4 text-blue-500" />
                </SidebarMenuAction>
                <SidebarMenuAction onClick={e => handleDeleteFile(e, file)} className="hover:bg-red-50 -mt-[0.4cm]" showOnHover>
                  <Trash2 className="w-4 h-4 text-blue-500" />
                </SidebarMenuAction>
              </div>
            </CollapsibleTrigger>
            {file.children && <CollapsibleContent className="ml-4">
                {renderFileTree(file.children, level + 1)}
              </CollapsibleContent>}
          </Collapsible> : <div className="group/menu-item relative">
            <SidebarMenuButton onClick={() => handleFileClick(file)} className="w-full text-left">
              {file.type === 'spreadsheet' ? <Table className="w-4 h-4 mr-2" /> : <File className="w-4 h-4 mr-2" />}
              <span>{file.name}</span>
            </SidebarMenuButton>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/menu-item:opacity-100 transition-opacity">
              <SidebarMenuAction onClick={e => handleRenameClick(e, file)} className="-mt-[0.4cm]" showOnHover>
                <FilePen className="w-4 h-4 text-blue-500" />
              </SidebarMenuAction>
              <SidebarMenuAction onClick={e => handleDeleteFile(e, file)} className="hover:bg-red-50 -mt-[0.4cm]" showOnHover>
                <Trash2 className="w-4 h-4 text-blue-500" />
              </SidebarMenuAction>
            </div>
          </div>}
      </SidebarMenuItem>);
  };
  
  const mainMenuItems = [{
    title: "Dashboard",
    icon: LayoutDashboard,
    onClick: () => setViewMode('welcome'),
    isActive: viewMode === 'welcome' || !viewMode
  }, {
    title: "Office Manager",
    icon: Building2,
    onClick: () => setViewMode('office'),
    isActive: viewMode === 'office'
  }, {
    title: "Knowledge Base",
    icon: Brain,
    onClick: () => setViewMode('knowledge'),
    isActive: viewMode === 'knowledge'
  }, {
    title: "AI Assistant",
    icon: FileText,
    onClick: () => setAiAssistantOpen(!aiAssistantOpen),
    isActive: aiAssistantOpen
  }];

  return <>
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center justify-between">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="h-6 w-6 hover:bg-app-gray-light">
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
                <NewFolderDialog />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.onClick} data-active={item.isActive}>
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
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
              {databaseTables.map(table => <SidebarMenuItem key={table.id}>
                  <SidebarMenuButton onClick={() => handleTableClick(table)} data-active={viewMode === 'database' && table.id === currentTable?.id}>
                    <Database className="w-4 h-4 mr-2" />
                    <span>{table.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Rename Dialog */}
      {renameItem && (
        <RenameItemDialog 
          item={renameItem} 
          isOpen={isRenameDialogOpen} 
          onClose={handleCloseRenameDialog} 
        />
      )}
    </>;
};

export const SidebarToggle = () => {
  const {
    setSidebarOpen
  } = useAppContext();
  return <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)} className="fixed top-4 left-4 z-20 h-8 w-8 bg-white shadow-sm">
      <Menu className="h-4 w-4" />
    </Button>;
};

export default AppSidebar;
