import React, { useState, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import NewDocumentDialog from './NewDocumentDialog';
import NewFolderDialog from './NewFolderDialog';
import RenameItemDialog from './RenameItemDialog';
import { FilePen, Brain, Building2, Database, File, FileText, Trash2, Folder, FolderOpen, Menu, Table, X, ChevronRight, ChevronDown, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
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
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragOverItem, setDragOverItem] = useState<any>(null);

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
  
  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.stopPropagation();
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50');
  };
  
  const handleDragOver = (e: React.DragEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.type === 'folder') {
      e.dataTransfer.dropEffect = 'move';
      setDragOverItem(item);
      e.currentTarget.classList.add('bg-sidebar-accent', 'bg-opacity-30');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-sidebar-accent', 'bg-opacity-30');
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItem(null);
    setDragOverItem(null);
  };
  
  const handleDrop = (e: React.DragEvent, targetFolder: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-sidebar-accent', 'bg-opacity-30');
    
    if (!draggedItem || targetFolder.id === draggedItem.id || !targetFolder.type || targetFolder.type !== 'folder') {
      return;
    }
    
    const deepCopyFiles = JSON.parse(JSON.stringify(files));
    
    const findItemPath = (filesList: any[], itemId: string, path: (number | string)[] = []): (number | string)[] | null => {
      for (let i = 0; i < filesList.length; i++) {
        if (filesList[i].id === itemId) {
          return [...path, i];
        }
        if (filesList[i].children) {
          const result = findItemPath(filesList[i].children, itemId, [...path, i, 'children']);
          if (result) return result;
        }
      }
      return null;
    };
    
    const findFolderPath = (filesList: any[], folderId: string, path: (number | string)[] = []): (number | string)[] | null => {
      for (let i = 0; i < filesList.length; i++) {
        if (filesList[i].id === folderId) {
          return [...path, i];
        }
        if (filesList[i].children) {
          const result = findFolderPath(filesList[i].children, folderId, [...path, i, 'children']);
          if (result) return result;
        }
      }
      return null;
    };
    
    const itemPath = findItemPath(deepCopyFiles, draggedItem.id);
    const folderPath = findFolderPath(deepCopyFiles, targetFolder.id);
    
    if (!itemPath || !folderPath) {
      return;
    }
    
    let currentLevel: any = deepCopyFiles;
    let itemToMove = null;
    let parentArray = null;
    let indexInParent = -1;
    
    for (let i = 0; i < itemPath.length; i++) {
      const pathPart = itemPath[i];
      if (i === itemPath.length - 1) {
        indexInParent = pathPart as number;
        itemToMove = currentLevel[pathPart as number];
        parentArray = currentLevel;
      } else {
        if (typeof pathPart === 'string') {
          currentLevel = currentLevel[pathPart as keyof typeof currentLevel];
        } else {
          currentLevel = currentLevel[pathPart as number];
        }
      }
    }
    
    let targetLevel: any = deepCopyFiles;
    for (let i = 0; i < folderPath.length; i++) {
      const pathPart = folderPath[i];
      if (typeof pathPart === 'string') {
        targetLevel = targetLevel[pathPart as keyof typeof targetLevel];
      } else {
        targetLevel = targetLevel[pathPart as number];
      }
    }
    
    if (!itemToMove || !targetLevel || !parentArray || indexInParent === -1) {
      return;
    }
    
    parentArray.splice(indexInParent, 1);
    
    if (!targetLevel.children) {
      targetLevel.children = [];
    }
    targetLevel.children.push(itemToMove);
    
    setFiles(deepCopyFiles);
    
    toast({
      title: "Item moved",
      description: `${itemToMove.name} moved to ${targetLevel.name}`
    });
    
    setDraggedItem(null);
    setDragOverItem(null);
  };
  
  const renderFileTree = (files: any[], level = 0) => {
    return files.map(file => <SidebarMenuItem key={file.id}>
        {file.type === 'folder' ? <Collapsible>
            <CollapsibleTrigger 
              className={`flex items-center w-full text-left p-2 hover:bg-sidebar-accent rounded-md group/menu-item relative ${dragOverItem?.id === file.id ? 'bg-sidebar-accent bg-opacity-30' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              onDragOver={(e) => handleDragOver(e, file)}
              onDragLeave={handleDragLeave}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, file)}
            >
              {file.children && file.children.length > 0 ? <>
                  <ChevronRight className="w-4 h-4 mr-2 transition-transform duration-200 transform group-data-[state=open]:rotate-90" />
                  <FolderOpen className="w-4 h-4 mr-2" />
                </> : <>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  <Folder className="w-4 h-4 mr-2" />
                </>}
              <span>{file.name}</span>
              <SidebarMenuAction onClick={e => handleDeleteFile(e, file)} className="hover:bg-red-50 -mt-[0.2cm] opacity-0 group-hover/menu-item:opacity-100 transition-opacity" showOnHover>
                <Trash2 className="w-4 h-4 text-app-blue" />
              </SidebarMenuAction>
            </CollapsibleTrigger>
            {file.children && <CollapsibleContent className="ml-4">
                {renderFileTree(file.children, level + 1)}
              </CollapsibleContent>}
          </Collapsible> : <div 
              className="group/menu-item relative"
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
              onDragEnd={handleDragEnd}
            >
            <SidebarMenuButton onClick={() => handleFileClick(file)} className="w-full text-left">
              {file.type === 'spreadsheet' ? <Table className="w-4 h-4 mr-2" /> : <File className="w-4 h-4 mr-2" />}
              <span>{file.name}</span>
            </SidebarMenuButton>
            <SidebarMenuAction onClick={e => handleDeleteFile(e, file)} className="hover:bg-red-50 -mt-[0.2cm] opacity-0 group-hover/menu-item:opacity-100 transition-opacity" showOnHover>
              <Trash2 className="w-4 h-4 text-app-blue" />
            </SidebarMenuAction>
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

      {/* Added Settings button at the bottom */}
      <SidebarFooter className="p-4 border-t mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setViewMode('settings')} data-active={viewMode === 'settings'}>
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

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
