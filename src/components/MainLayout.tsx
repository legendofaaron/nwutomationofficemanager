import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import DocumentViewer from './DocumentViewer';
import DatabaseViewer from './DatabaseViewer';
import KnowledgeBase from './KnowledgeBase';
import AiAssistant from './AiAssistant';
import ChatUI from './ChatUI';
import OfficeManagerDashboard from './OfficeManagerDashboard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Receipt, Brain, Database, Building2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
            
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 bg-white shadow-sm min-h-[calc(100vh-64px)] rounded-md">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div className="flex items-center gap-4">
                {/* Office Manager Section */}
                <Button 
                  size="sm" 
                  variant={viewMode === 'office' ? "default" : "outline"}
                  onClick={() => setViewMode('office')}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Office Manager
                </Button>

                {/* Database & Knowledge Section */}
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Database
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setViewMode('knowledge')}>
                    <Brain className="mr-2 h-4 w-4" />
                    Knowledge Base
                  </Button>
                </div>

                {/* Document Creation */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Create Document
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      New Document
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Receipt className="mr-2 h-4 w-4" />
                      New Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      New Schedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* AI Assistant Button */}
                <Button 
                  size="sm" 
                  variant={aiAssistantOpen ? "default" : "outline"}
                  onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  AI Assistant
                </Button>
              </div>
            </div>
            
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
