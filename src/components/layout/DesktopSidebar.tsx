
import React from 'react';
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
  
  const handleMouseLeave = () => {
    if (!isMobile && document.querySelector('.sidebar-container')?.contains(document.activeElement) === false) {
      setOpen(false);
    }
  };
  
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
