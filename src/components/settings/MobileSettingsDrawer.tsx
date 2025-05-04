
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { useAppContext } from '@/context/AppContext';

interface MobileSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MobileSettingsDrawer = ({ open, onClose }: MobileSettingsDrawerProps) => {
  const { branding } = useAppContext();
  
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>{branding.companyName} Settings</DrawerTitle>
              <DrawerDescription>
                Configure your system preferences
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="p-6 overflow-auto flex-1">
          <GeneralSettingsTab />
        </div>
        
        <DrawerFooter className="border-t">
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
