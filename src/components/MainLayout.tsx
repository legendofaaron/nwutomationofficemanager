
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
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
import { LogOut, Menu, Sparkles, User, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserAvatar } from './UserAvatar';
import { ProLayout } from './ProLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import type { ViewMode } from '@/context/AppContext';
import { DragDropProvider } from './schedule/DragDropContext';
import '../components/schedule/dragAndDrop.css';

const MainLayout = () => {
  const {
    viewMode,
    sidebarOpen,
    aiAssistantOpen,
    setAiAssistantOpen,
    setViewMode
  } = useAppContext();

  const { user, signOut } = useAuth();
  const [triggerPosition, setTriggerPosition] = useState(24); // Default position (top: 24)
  const isDragging = useRef(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    }
  };

  const navigateToProfile = () => {
    setViewMode('settings');
    // Adding a small delay to ensure the settings component is mounted before trying to focus on the profile tab
    setTimeout(() => {
      const profileTab = document.querySelector('[value="profile"]');
      if (profileTab) {
        (profileTab as HTMLElement).click();
      }
    }, 100);
  };

  const handleCloseCalendars = (e: React.MouseEvent) => {
    // Only close non-calendar popovers when clicking on the main content area
    // We don't use stopPropagation to allow normal click events to still work
    const target = e.target as HTMLElement;
    
    // Only close if we're clicking directly on the main content
    // and not on interactive elements or the calendar itself
    if (target.closest('[role="dialog"]') || 
        target.closest('button') || 
        target.closest('input') ||
        target.closest('[data-calendar]') ||
        target.closest('.calendar-component')) {
      return;
    }
    
    // Dispatch a custom event to close all non-calendar popovers
    document.dispatchEvent(new CustomEvent('closeAllPopovers', {
      detail: { exceptId: 'todo-calendar-bubble' }
    }));
  };

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
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

  // Render mobile header
  const renderMobileHeader = () => (
    <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-3 border-b bg-background border-border">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Logo onClick={() => {
                handleViewChange('welcome');
                setMobileMenuOpen(false);
              }} />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <AppSidebar />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <Logo small onClick={() => handleViewChange('welcome')} />
      
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <UserAvatar className="h-8 w-8 transition-all hover:scale-105 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserAvatar className="h-7 w-7" />
            <div className="flex flex-col">
              <span className="font-medium">{user?.user_metadata?.full_name || 'User'}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleViewChange('settings')} className="cursor-pointer">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 dark:text-red-400">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <ProLayout>
      <DragDropProvider>
        <SidebarProvider defaultOpen={!isMobile && sidebarOpen}>
          <div className={`h-screen ${isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-gradient-to-br from-white to-gray-100'} flex w-full overflow-hidden`}>
            {isMobile ? (
              renderMobileHeader()
            ) : (
              <div className="relative sidebar-container">
                <Sidebar className="shadow-md border-r border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center p-4">
                    <Logo onClick={() => setViewMode('welcome')} />
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                        <UserAvatar className="h-9 w-9 transition-all hover:scale-105 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="flex items-center gap-2">
                          <UserAvatar className="h-7 w-7" />
                          <div className="flex flex-col">
                            <span className="font-medium">{user?.user_metadata?.full_name || 'User'}</span>
                            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer">
                          Profile
                        </DropdownMenuItem>
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
                      <Logo small />
                    </div>
                  </SidebarTrigger>
                </div>
              </div>
            )}
            
            <main 
              className={cn("h-screen transition-all duration-300 flex-1 overflow-hidden", 
                isMobile ? "pt-14" : (sidebarOpen ? "ml-0" : "ml-0"))}
              onClick={handleCloseCalendars}
            >
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
            <div className={`fixed bottom-6 right-6 z-50 ${isMobile ? 'mb-4' : ''}`}>
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
      </DragDropProvider>
    </ProLayout>
  );
};

export default MainLayout;
