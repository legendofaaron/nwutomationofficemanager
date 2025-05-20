
import React, { useEffect } from 'react';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import AppSidebar from '@/components/AppSidebar';
import { UserMenu } from './UserMenu';
import { ViewMode } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface DesktopSidebarProps {
  setViewMode: (mode: ViewMode) => void;
  confirmLogout: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  setViewMode,
  confirmLogout
}) => {
  const isMobile = useIsMobile();
  const { setOpen } = useSidebar();
  
  // Handle mouse leave event to close the sidebar
  const handleMouseLeave = () => {
    if (!isMobile && document.querySelector('.sidebar-container')?.contains(document.activeElement) === false) {
      setOpen(false);
    }
  };
  
  // Set up click outside listener
  useEffect(() => {
    if (isMobile) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const sidebarContainer = document.querySelector('.sidebar-container');
      const sidebar = document.querySelector('[data-sidebar="sidebar"]');
      const target = event.target as HTMLElement;
      
      // Check if click is outside sidebar and its trigger button
      if (
        sidebar && 
        !sidebar.contains(target) && 
        sidebarContainer && 
        !sidebarContainer.contains(target) &&
        !target.closest('[data-sidebar="trigger"]')
      ) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, setOpen]);
  
  return (
    <Sidebar 
      className="shadow-md border-r border-gray-100 dark:border-gray-800"
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-center p-3 sm:p-4">
        <Logo onClick={() => setViewMode('welcome')} />
        <UserMenu setViewMode={setViewMode} confirmLogout={confirmLogout} />
      </div>
      <AppSidebar />
    </Sidebar>
  );
};
