import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LlmSettings } from './LlmSettings';
import { GeneralSettingsTab } from './settings/GeneralSettingsTab';
import { AppearanceSettingsTab } from './settings/AppearanceSettingsTab';
import { BrandingSettingsTab } from './settings/BrandingSettingsTab';
import { DatabaseSettingsTab } from './settings/DatabaseSettingsTab';
import { ProfileSettings } from './settings/ProfileSettings';
import { TooltipProvider } from '@/components/ui/tooltip';

const SystemSettings = () => {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">System Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Manage system settings and configurations
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 py-4">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4 py-4">
            <GeneralSettingsTab />
          </TabsContent>
          
          <TabsContent value="branding" className="space-y-4 py-4">
            <BrandingSettingsTab />
          </TabsContent>
          
          <TabsContent value="database" className="space-y-4 py-4">
            <DatabaseSettingsTab />
          </TabsContent>
          
          <TabsContent value="integrations" className="py-4">
            <LlmSettings />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 py-4">
            <AppearanceSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default SystemSettings;
