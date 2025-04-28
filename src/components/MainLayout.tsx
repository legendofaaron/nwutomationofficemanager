
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import AppSidebar from './AppSidebar';
import DocumentViewer from './DocumentViewer';
import DatabaseViewer from './DatabaseViewer';
import KnowledgeBase from './KnowledgeBase';
import AiAssistant from './AiAssistant';
import ChatUI from './ChatUI';
import OfficeManagerDashboard from './OfficeManagerDashboard';
import SpreadsheetViewer from './SpreadsheetViewer';
import { cn } from '@/lib/utils';
import { SidebarProvider, Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from './Logo';

const MainLayout = () => {
  const {
    viewMode,
    sidebarOpen,
    aiAssistantOpen
  } = useAppContext();

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="h-screen bg-app-gray-lightest flex w-full overflow-hidden">
        <div className="relative">
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarTrigger className="absolute -right-12 top-24 z-20 h-16 w-12 bg-white shadow-md rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Logo />
          </SidebarTrigger>
        </div>
        
        <main className={cn("h-screen transition-all duration-300 pt-8 flex-1 overflow-hidden", sidebarOpen ? "ml-64 pl-4" : "ml-0")}>
          <div className="w-full bg-white shadow-sm h-[calc(100vh-64px)] rounded-md overflow-hidden">
            {viewMode === 'document' && <DocumentViewer />}
            {viewMode === 'database' && <DatabaseViewer />}
            {viewMode === 'knowledge' && <KnowledgeBase />}
            {viewMode === 'office' && <OfficeManagerDashboard />}
            {viewMode === 'spreadsheet' && <SpreadsheetViewer />}
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

