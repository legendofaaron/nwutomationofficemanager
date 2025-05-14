
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/Logo';
import AppSidebar from '@/components/AppSidebar';
import { UserMenu } from './UserMenu';
import { ViewMode } from '@/context/AppContext';

interface MobileHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  handleViewChange: (view: ViewMode) => void;
  setViewMode: (mode: ViewMode) => void;
  confirmLogout: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  handleViewChange,
  setViewMode,
  confirmLogout
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-2 sm:p-3 border-b bg-background border-border">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden flex items-center justify-center p-1.5">
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
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
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
      
      <UserMenu setViewMode={setViewMode} confirmLogout={confirmLogout} />
    </div>
  );
};
