
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';

export const AppearanceSettingsTab = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">Dark Mode</h3>
          <p className="text-sm text-muted-foreground">
            Enable dark mode for the entire application.
          </p>
        </div>
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={(checked) => {
            setTheme(checked ? 'dark' : 'light');
            toast({
              title: "Appearance updated",
              description: `Theme changed to ${checked ? 'dark' : 'light'} mode.`,
            });
          }}
        />
      </div>
          
      <Button onClick={() => {
        toast({
          title: "Appearance settings saved",
          description: "Your appearance preferences have been updated."
        });
      }}>
        Save Preferences
      </Button>
    </>
  );
};
