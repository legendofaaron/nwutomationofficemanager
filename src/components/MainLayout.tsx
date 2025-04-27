
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar';
import DocumentViewer from './DocumentViewer';
import DatabaseViewer from './DatabaseViewer';
import KnowledgeBase from './KnowledgeBase';
import AiAssistant from './AiAssistant';
import ChatUI from './ChatUI';
import OfficeManagerDashboard from './OfficeManagerDashboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, Files, Brain, Database, Building2 } from 'lucide-react';
import { Logo } from './Logo';

const MainLayout = () => {
  const {
    viewMode,
    setViewMode,
    sidebarOpen,
    aiAssistantOpen,
    setAiAssistantOpen
  } = useAppContext();

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="flex min-h-screen bg-app-gray-lightest">
        <Sidebar className="border-r bg-white">
          <SidebarHeader>
            <div className="flex items-center justify-between px-4 py-2">
              <Logo />
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={viewMode === 'office'}
                      onClick={() => setViewMode('office')}
                      tooltip="Office Manager"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Office Manager</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={viewMode === 'files'}
                      onClick={() => setViewMode('files')}
                      tooltip="Files"
                    >
                      <Files className="w-4 h-4" />
                      <span>Files</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={viewMode === 'database'}
                      onClick={() => setViewMode('database')}
                      tooltip="Database"
                    >
                      <Database className="w-4 h-4" />
                      <span>Database</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={viewMode === 'knowledge'}
                      onClick={() => setViewMode('knowledge')}
                      tooltip="Knowledge Base"
                    >
                      <Brain className="w-4 h-4" />
                      <span>Knowledge Base</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
                      isActive={aiAssistantOpen}
                      tooltip="AI Assistant"
                    >
                      <FileText className="w-4 h-4" />
                      <span>AI Assistant</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 bg-white shadow-sm min-h-[calc(100vh-64px)] rounded-md">
            {viewMode === 'document' && <DocumentViewer />}
            {viewMode === 'database' && <DatabaseViewer />}
            {viewMode === 'knowledge' && <KnowledgeBase />}
            {viewMode === 'office' && <OfficeManagerDashboard />}
            {viewMode === 'files' && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Select a file or database table to view</p>
              </div>
            )}
          </div>
        </main>
        
        <AiAssistant />
        <ChatUI />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

