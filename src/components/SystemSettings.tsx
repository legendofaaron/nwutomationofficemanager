
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LlmSettings } from './LlmSettings';
import { GeneralSettingsTab } from './settings/GeneralSettingsTab';
import { AppearanceSettingsTab } from './settings/AppearanceSettingsTab';
import { BrandingSettingsTab } from './settings/BrandingSettingsTab';
import { DatabaseSettingsTab } from './settings/DatabaseSettingsTab';
import { ProfileSettings } from './settings/ProfileSettings';
import { SubscriptionSettingsTab } from './settings/SubscriptionSettingsTab';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';

const SystemSettings = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">System Configuration</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your system settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className={`grid w-full grid-cols-7 p-1 ${
            isSuperDark ? 'bg-[#0A0A0A] border border-[#181818]' : 
            isDark ? 'bg-[#0d1117] border border-[#1a1e26]' : 
            'bg-gray-50'
          } rounded-lg`}>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 py-6">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4 py-6">
            <GeneralSettingsTab />
          </TabsContent>
          
          <TabsContent value="branding" className="space-y-4 py-6">
            <BrandingSettingsTab />
          </TabsContent>
          
          <TabsContent value="database" className="space-y-4 py-6">
            <DatabaseSettingsTab />
          </TabsContent>
          
          <TabsContent value="integrations" className="py-6">
            <LlmSettings />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 py-6">
            <AppearanceSettingsTab />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4 py-6">
            <SubscriptionSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default SystemSettings;
