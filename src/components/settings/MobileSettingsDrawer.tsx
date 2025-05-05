
import React, { useState } from 'react';
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
import { AppearanceSettingsTab } from './AppearanceSettingsTab';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LlmSettings } from '@/components/LlmSettings';
import { DatabaseSettingsTab } from './DatabaseSettingsTab';
import { StorageSettingsTab } from './StorageSettingsTab';
import { useTheme } from '@/context/ThemeContext';

interface MobileSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MobileSettingsDrawer = ({ open, onClose }: MobileSettingsDrawerProps) => {
  const { branding } = useAppContext();
  const [activeTab, setActiveTab] = useState("general");
  const { resolvedTheme } = useTheme();
  const isSuperDark = resolvedTheme === 'superdark';
  
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className={`h-[85vh] ${isSuperDark ? 'bg-black border-t border-[#151515]' : ''}`}>
        <DrawerHeader className={`border-b ${isSuperDark ? 'border-[#151515]' : ''}`}>
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
        
        <div className="p-4 overflow-auto flex-1">
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <GeneralSettingsTab />
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <AppearanceSettingsTab />
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              <LlmSettings />
            </TabsContent>
            
            <TabsContent value="database" className="space-y-4">
              <DatabaseSettingsTab />
            </TabsContent>
            
            <TabsContent value="storage" className="space-y-4">
              <StorageSettingsTab />
            </TabsContent>
          </Tabs>
        </div>
        
        <DrawerFooter className={`border-t ${isSuperDark ? 'border-[#151515]' : ''}`}>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
