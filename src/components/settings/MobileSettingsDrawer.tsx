
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
import { useIsMobile } from '@/hooks/use-mobile';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MobileSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  useN8nChat?: boolean;
  onToggleN8n?: () => void;
}

export const MobileSettingsDrawer = ({ 
  open, 
  onClose, 
  useN8nChat = false, 
  onToggleN8n 
}: MobileSettingsDrawerProps) => {
  const { branding } = useAppContext();
  const [activeTab, setActiveTab] = useState("general");
  const { resolvedTheme } = useTheme();
  const isSuperDark = resolvedTheme === 'superdark';
  const isMobile = useIsMobile();
  
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className={`${isMobile ? 'h-[90vh]' : 'h-[85vh]'} ${isSuperDark ? 'bg-black border-t border-[#151515]' : ''}`}>
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
          {onToggleN8n && (
            <div className="mb-6 p-4 border rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-medium">n8n Chat Integration</h3>
                <p className="text-sm text-gray-500">Switch between native and n8n chat</p>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="n8n-mode">
                  {useN8nChat ? 'Enabled' : 'Disabled'}
                </Label>
                <Switch 
                  id="n8n-mode" 
                  checked={useN8nChat} 
                  onCheckedChange={onToggleN8n} 
                />
              </div>
            </div>
          )}
          
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-3'} mb-4`}>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              {!isMobile && <TabsTrigger value="database">Database</TabsTrigger>}
            </TabsList>
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-2'} mb-6`}>
              {isMobile && <TabsTrigger value="database">Database</TabsTrigger>}
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <GeneralSettingsTab />
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <AppearanceSettingsTab />
            </TabsContent>
            
            <TabsContent value="database" className="space-y-4">
              <DatabaseSettingsTab />
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              <LlmSettings />
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
