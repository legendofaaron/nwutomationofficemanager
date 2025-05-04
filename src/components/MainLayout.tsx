
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import AppSidebar from './AppSidebar';
import DocumentViewer from './DocumentViewer';
import DatabaseViewer from './DatabaseViewer';
import KnowledgeBase from './KnowledgeBase';
import AiAssistant from './AiAssistant';
import OfficeManagerDashboard from './OfficeManagerDashboard';
import SpreadsheetViewer from './SpreadsheetViewer';
import WelcomeDashboard from './WelcomeDashboard';
import TodoCalendarBubble from './TodoCalendarBubble';
import { cn } from '@/lib/utils';
import { SidebarProvider, Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from './Logo';
import { Bot } from 'lucide-react';

const MainLayout = () => {
  const {
    viewMode,
    sidebarOpen,
    aiAssistantOpen,
    setAiAssistantOpen
  } = useAppContext();

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="h-screen bg-app-gray-lightest flex w-full overflow-hidden">
        <div className="relative">
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarTrigger className="absolute -right-12 top-24 z-20 h-16 w-12 bg-white shadow-md rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors group">
            <div className="transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]">
              <Logo small />
            </div>
          </SidebarTrigger>
        </div>
        
        <main className={cn("h-screen transition-all duration-300 flex-1 overflow-hidden", sidebarOpen ? "ml-0" : "ml-0")}>
          <div className="w-full bg-white shadow-sm h-[calc(100vh-64px)] rounded-md overflow-auto">
            {viewMode === 'document' && <DocumentViewer />}
            {viewMode === 'database' && <DatabaseViewer />}
            {viewMode === 'knowledge' && <KnowledgeBase />}
            {viewMode === 'office' && <OfficeManagerDashboard />}
            {viewMode === 'spreadsheet' && <SpreadsheetViewer />}
            {viewMode === 'welcome' && <WelcomeDashboard />}
            {!viewMode && <WelcomeDashboard />}
          </div>
        </main>
        
        <TodoCalendarBubble />
        
        {/* AI Assistant Floating Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)} 
            className="h-12 w-12 rounded-full shadow-lg bg-primary relative flex items-center justify-center hover:bg-primary/90 transition-colors text-primary-foreground"
          >
            <Bot className="h-5 w-5" />
            {aiAssistantOpen && (
              <span className="absolute top-0 right-0 h-3 w-3 bg-destructive rounded-full border-2 border-background"></span>
            )}
          </button>
        </div>
        
        {/* AI Assistant Panel */}
        <AiAssistant />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
