
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
import { Bot, LogOut, Sparkles, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProLayout } from './ProLayout';

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
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/login');
  };

  const sidebarButtonBg = isSuperDark 
    ? 'bg-black border border-[#151515]' 
    : isDark 
      ? 'bg-[#0d0f13] border border-[#1a1e26]'
      : 'bg-white border border-gray-200 shadow-sm';

  const sidebarHoverBg = isSuperDark
    ? 'hover:bg-[#0a0a0a]'
    : isDark
      ? 'hover:bg-[#171b24]'
      : 'hover:bg-gray-50';

  const mainBg = isSuperDark
    ? 'bg-black'
    : isDark
      ? 'bg-[#0a0c10]'
      : 'bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm';

  return (
    <ProLayout>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <div className={`h-screen ${isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-gradient-to-br from-white to-gray-100'} flex w-full overflow-hidden`}>
          <div className="relative sidebar-container">
            <Sidebar className="shadow-md border-r border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center p-4">
                <Logo small onClick={() => setViewMode('welcome')} />
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Avatar className="h-9 w-9 transition-all hover:scale-105">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setViewMode('settings')} className="cursor-pointer">
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <AppSidebar />
            </Sidebar>
            <div 
              className="absolute -right-12 z-20" 
              style={{ top: `${triggerPosition}px` }}
            >
              <SidebarTrigger 
                className={`h-16 w-12 ${sidebarButtonBg} rounded-r-lg flex items-center justify-center ${sidebarHoverBg} transition-all group cursor-move`}
                onMouseDown={handleDragStart}
              >
                <div className="transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]">
                  {/* Remove Logo from the sidebar trigger to avoid duplicate logos */}
                  <div className="relative">
                    <div className={`rounded-full border-2 border-app-blue ${small ? 'p-0.5' : 'p-1'}`}>
                      <Hexagon className="h-6 w-6 text-app-blue" />
                    </div>
                  </div>
                </div>
              </SidebarTrigger>
            </div>
          </div>
          
          <main className={cn("h-screen transition-all duration-300 flex-1 overflow-hidden", sidebarOpen ? "ml-0" : "ml-0")}>
            <div className={`w-full ${mainBg} h-full rounded-md overflow-auto`}>
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
          
          {/* AI Assistant Button with improved styling */}
          <div className="fixed bottom-6 right-6 z-50">
            <button 
              onClick={() => setAiAssistantOpen(!aiAssistantOpen)} 
              className={`h-14 w-14 rounded-full shadow-lg ${isDark || isSuperDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} 
              relative flex items-center justify-center transition-colors text-white hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200`}
              aria-label="Toggle AI Assistant"
            >
              <Sparkles className="h-6 w-6" />
              {aiAssistantOpen && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
              )}
            </button>
          </div>
          
          {/* AI Assistant Panel */}
          <AiAssistant />
        </div>
      </SidebarProvider>
    </ProLayout>
  );
};

export default MainLayout;
