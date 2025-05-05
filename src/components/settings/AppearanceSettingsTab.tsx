
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const AppearanceSettingsTab = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Theme</h2>
          <p className="text-sm text-muted-foreground">
            Select your preferred theme for the application
          </p>
          <RadioGroup
            defaultValue={theme}
            onValueChange={(value) => {
              setTheme(value as 'light' | 'dark' | 'system');
              toast({
                title: "Appearance updated",
                description: `Theme changed to ${value} mode.`,
              });
            }}
            className="grid grid-cols-3 gap-4 pt-2"
          >
            <div>
              <RadioGroupItem
                value="light"
                id="theme-light"
                className="sr-only"
              />
              <Label
                htmlFor="theme-light"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                  theme === 'light' ? 'border-primary' : ''
                }`}
              >
                <Sun className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">Light</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="dark"
                id="theme-dark"
                className="sr-only"
              />
              <Label
                htmlFor="theme-dark"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                  theme === 'dark' ? 'border-primary' : ''
                }`}
              >
                <Moon className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="system"
                id="theme-system"
                className="sr-only"
              />
              <Label
                htmlFor="theme-system"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                  theme === 'system' ? 'border-primary' : ''
                }`}
              >
                <Monitor className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">System</span>
              </Label>
            </div>
          </RadioGroup>
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
      </div>
    </>
  );
};
