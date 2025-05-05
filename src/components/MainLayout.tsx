
import React, { useState, useRef } from 'react';
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
import { Bot, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const MainLayout = () => {
  const {
    viewMode,
    sidebarOpen,
    aiAssistantOpen,
    setAiAssistantOpen,
    setViewMode
  } = useAppContext();

  const [triggerPosition, setTriggerPosition] = useState(24); // Default position (top: 24)
  const isDragging = useRef(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDrag = (e: MouseEvent) => {
    if (isDragging.current) {
      const sidebarElement = document.querySelector('.sidebar-container');
      if (sidebarElement) {
        const sidebarRect = sidebarElement.getBoundingClientRect();
        const newPosition = Math.max(16, Math.min(e.clientY - sidebarRect.top, sidebarRect.height - 80));
        setTriggerPosition(newPosition);
      }
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const sidebarButtonBg = isSuperDark 
    ? 'bg-black border border-[#151515]' 
    : isDark 
      ? 'bg-[#0d0f13] border border-[#1a1e26]'
      : 'bg-white border border-blue-100 shadow-blue-100/30';

  const sidebarHoverBg = isSuperDark
    ? 'hover:bg-[#0a0a0a]'
    : isDark
      ? 'hover:bg-[#171b24]'
      : 'hover:bg-blue-50';

  const mainBg = isSuperDark
    ? 'bg-black'
    : isDark
      ? 'bg-[#0a0c10]'
      : 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-sm';

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className={`h-screen ${isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} flex w-full overflow-hidden`}>
        <div className="relative sidebar-container">
          <Sidebar className="shadow-lg">
            <AppSidebar />
          </Sidebar>
          <div 
            className="absolute -right-12 z-20" 
            style={{ top: `${triggerPosition}px` }}
          >
            <SidebarTrigger 
              className={`h-16 w-12 ${sidebarButtonBg} shadow-md rounded-r-lg flex items-center justify-center ${sidebarHoverBg} transition-all group cursor-move`}
              onMouseDown={handleDragStart}
            >
              <div className="transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]">
                <Logo small onClick={() => setViewMode('welcome')} />
              </div>
            </SidebarTrigger>
          </div>
        </div>
        
        <main className={cn("h-screen transition-all duration-300 flex-1 overflow-hidden", sidebarOpen ? "ml-0" : "ml-0")}>
          <div className={`w-full ${mainBg} shadow-sm h-full rounded-md overflow-auto`}>
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
            className={`h-14 w-14 rounded-full shadow-lg ${isDark || isSuperDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-primary hover:bg-primary/90'} relative flex items-center justify-center transition-colors text-primary-foreground hover:scale-105 active:scale-95 transition-transform duration-200 animate-pulse-slow`}
          >
            <Sparkles className="h-6 w-6" />
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
