
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const AppearanceSettingsTab = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <div className="flex items-center">
            {theme === 'dark' ? 
              <Moon className="mr-2 h-4 w-4" /> : 
              <Sun className="mr-2 h-4 w-4" />
            }
            <h3 className="text-base font-medium">Theme Mode</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Toggle between light and dark mode
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
      
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">High Contrast</h3>
          <p className="text-sm text-muted-foreground">
            Increase contrast for better visibility
          </p>
        </div>
        <Switch 
          onCheckedChange={(checked) => {
            toast({
              title: "Appearance updated",
              description: `High contrast mode ${checked ? 'enabled' : 'disabled'}.`,
            });
          }}
        />
      </div>
      
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">Animations</h3>
          <p className="text-sm text-muted-foreground">
            Enable or disable UI animations
          </p>
        </div>
        <Switch 
          defaultChecked
          onCheckedChange={(checked) => {
            toast({
              title: "Appearance updated",
              description: `Animations ${checked ? 'enabled' : 'disabled'}.`,
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
