
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import AppSidebar, { SidebarToggle } from './AppSidebar';
import DocumentViewer from './DocumentViewer';
import DatabaseViewer from './DatabaseViewer';
import KnowledgeBase from './KnowledgeBase';
import AiAssistant from './AiAssistant';
import ChatUI from './ChatUI';
import OfficeManagerDashboard from './OfficeManagerDashboard';
import { cn } from '@/lib/utils';
import { Brain, Building2, Database, FileText } from 'lucide-react';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';

const MainLayout = () => {
  const {
    viewMode,
    sidebarOpen,
    aiAssistantOpen
  } = useAppContext();

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="min-h-screen bg-app-gray-lightest flex w-full">
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        
        <main className={cn("min-h-screen transition-all duration-300 pt-16 flex-1", sidebarOpen ? "ml-64" : "ml-0")}>
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
      <SidebarToggle />
    </SidebarProvider>
  );
};

export default MainLayout;
