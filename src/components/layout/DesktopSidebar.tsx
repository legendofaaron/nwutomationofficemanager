
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import AppSidebar from '@/components/AppSidebar';
import { UserMenu } from './UserMenu';
import { ViewMode } from '@/context/AppContext';

interface DesktopSidebarProps {
  setViewMode: (mode: ViewMode) => void;
  confirmLogout: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  setViewMode,
  confirmLogout
}) => {
  return (
    <Sidebar className="shadow-md border-r border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center p-3 sm:p-4">
        <Logo onClick={() => setViewMode('welcome')} />
        <UserMenu setViewMode={setViewMode} confirmLogout={confirmLogout} />
      </div>
      <AppSidebar />
    </Sidebar>
  );
};
