
import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import DocumentViewer from './DocumentViewer';
import DatabaseViewer from './DatabaseViewer';
import KnowledgeBase from './KnowledgeBase';
import AiAssistant from './AiAssistant';
import OfficeManagerDashboard from './OfficeManagerDashboard';
import SpreadsheetViewer from './SpreadsheetViewer';
import WelcomeDashboard from './WelcomeDashboard';
import TodoCalendarBubble from './TodoCalendarBubble';
import { cn } from '@/lib/utils';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { DragDropProvider } from './schedule/DragDropContext';
import '../components/schedule/dragAndDrop.css';
import SystemSettings from './SystemSettings';
import { useDrag } from '@/hooks/useDrag';
import { useLogout } from '@/hooks/useLogout';
import { MobileHeader } from './layout/MobileHeader';
import { DesktopSidebar } from './layout/DesktopSidebar';
import { SidebarTriggerButton } from './layout/SidebarTriggerButton';
import { AiAssistantButton } from './layout/AiAssistantButton';
import { LogoutDialog } from './layout/LogoutDialog';
import type { ViewMode } from '@/context/AppContext';

/**
 * MainLayout Component
 * 
 * The main layout component that contains the application's structure including
 * sidebar, main content area, and various UI elements.
 */
const MainLayout = () => {
  // App context state
  const {
    viewMode,
    sidebarOpen,
    aiAssistantOpen,
    setAiAssistantOpen,
    setViewMode
  } = useAppContext();

  // Theme state
  const { resolvedTheme } = useTheme();
  const isDark = useMemo(() => resolvedTheme === 'dark', [resolvedTheme]);
  const isSuperDark = useMemo(() => resolvedTheme === 'superdark', [resolvedTheme]);

  // Mobile state
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom hooks
  const { position: triggerPosition, handleDragStart } = useDrag(24);
  const { showLogoutConfirm, setShowLogoutConfirm, confirmLogout, handleLogout } = useLogout();

  // Handle view mode change
  const handleViewChange = useCallback((newView: ViewMode) => {
    setViewMode(newView);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, setViewMode]);

  // Toggle AI assistant
  const handleToggleAiAssistant = useCallback(() => {
    setAiAssistantOpen(!aiAssistantOpen);
  }, [aiAssistantOpen, setAiAssistantOpen]);

  // Handle closing calendars when clicking outside
  const handleCloseCalendars = useCallback((e: React.MouseEvent) => {
    // Only close non-calendar popovers when clicking on the main content area
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
  }, []);

  // Background style based on theme - memoized to prevent unnecessary recalculations
  const mainBg = useMemo(() => {
    return isSuperDark
      ? 'bg-black'
      : isDark
        ? 'bg-[#0a0c10]'
        : 'bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm';
  }, [isSuperDark, isDark]);

  return (
    <DragDropProvider>
      <SidebarProvider>
        <div className={`h-screen ${isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-gradient-to-br from-white to-gray-100'} flex w-full overflow-hidden`}>
          {isMobile ? (
            <MobileHeader
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              handleViewChange={handleViewChange}
              setViewMode={setViewMode}
              confirmLogout={confirmLogout}
            />
          ) : (
            <div 
              className="relative sidebar-container" 
              onMouseLeave={() => !isMobile && document.querySelector('.sidebar-container')?.contains(document.activeElement) === false && useSidebar().setOpen(false)}
            >
              <DesktopSidebar 
                setViewMode={setViewMode}
                confirmLogout={confirmLogout}
              />
              
              <SidebarTriggerButton 
                triggerPosition={triggerPosition}
                onDragStart={handleDragStart}
              />
            </div>
          )}
          
          <main 
            className={cn("h-screen transition-all duration-300 flex-1 overflow-hidden", 
              isMobile ? "pt-16 sm:pt-20" : (sidebarOpen ? "pt-16 ml-0" : "pt-16 ml-0"))}
            onClick={handleCloseCalendars}
          >
            <div className={`w-full ${mainBg} h-full rounded-md overflow-auto`}>
              {viewMode === 'document' && <DocumentViewer />}
              {viewMode === 'database' && <DatabaseViewer />}
              {viewMode === 'knowledge' && <KnowledgeBase />}
              {viewMode === 'office' && <OfficeManagerDashboard />}
              {viewMode === 'spreadsheet' && <SpreadsheetViewer />}
              {viewMode === 'welcome' && <WelcomeDashboard />}
              {viewMode === 'settings' && <SystemSettings />}
              {!viewMode && <WelcomeDashboard />}
            </div>
          </main>
          
          <TodoCalendarBubble />
          
          {/* AI Assistant Button - moved to the sidebar style */}
          <AiAssistantButton 
            aiAssistantOpen={aiAssistantOpen} 
            handleToggleAiAssistant={handleToggleAiAssistant} 
          />
          
          {/* AI Assistant Panel */}
          <AiAssistant />
          
          {/* Logout Confirmation Dialog */}
          <LogoutDialog 
            showLogoutConfirm={showLogoutConfirm}
            setShowLogoutConfirm={setShowLogoutConfirm}
            handleLogout={handleLogout}
          />
        </div>
      </SidebarProvider>
    </DragDropProvider>
  );
};

export default React.memo(MainLayout);
