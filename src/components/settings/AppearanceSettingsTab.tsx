
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Monitor, MoonStar } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export const AppearanceSettingsTab = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Theme Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Choose your preferred theme for the application interface
          </p>
          <RadioGroup
            defaultValue={theme}
            onValueChange={(value) => {
              setTheme(value as 'light' | 'dark' | 'superdark' | 'system');
              toast({
                title: "Theme updated",
                description: `Theme changed to ${value} mode.`,
                variant: "default"
              });
            }}
            className="grid grid-cols-4 gap-4 pt-2"
          >
            <div>
              <RadioGroupItem
                value="light"
                id="theme-light"
                className="sr-only"
              />
              <Label
                htmlFor="theme-light"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-200 ${
                  theme === 'light' ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                <Sun className="h-6 w-6 mb-3 text-amber-500" />
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
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-200 ${
                  theme === 'dark' ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                <Moon className="h-6 w-6 mb-3 text-indigo-400" />
                <span className="text-sm font-medium">Dark</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="superdark"
                id="theme-superdark"
                className="sr-only"
              />
              <Label
                htmlFor="theme-superdark"
                className={`flex flex-col items-center justify-between rounded-md border-2 ${
                  theme === 'superdark' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-muted'
                } bg-[#050505] text-gray-200 p-4 hover:bg-[#0a0a0a] hover:text-white transition-all duration-200`}
              >
                <MoonStar className="h-6 w-6 mb-3 text-blue-500" />
                <span className="text-sm font-medium">Super Dark</span>
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
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-200 ${
                  theme === 'system' ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                <Monitor className="h-6 w-6 mb-3 text-emerald-500" />
                <span className="text-sm font-medium">System</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Reduced Motion</h3>
                  <p className="text-sm text-muted-foreground">
                    Decrease animation for better accessibility
                  </p>
                </div>
                <Switch 
                  onCheckedChange={(checked) => {
                    toast({
                      title: "Preference updated",
                      description: `Reduced motion ${checked ? 'enabled' : 'disabled'}.`,
                      variant: "default"
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">High Contrast</h3>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for improved visibility
                  </p>
                </div>
                <Switch 
                  onCheckedChange={(checked) => {
                    toast({
                      title: "Preference updated",
                      description: `High contrast mode ${checked ? 'enabled' : 'disabled'}.`,
                      variant: "default"
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex flex-row items-center justify-between">
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
                      title: "Preference updated",
                      description: `Animations ${checked ? 'enabled' : 'disabled'}.`,
                      variant: "default"
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">Sound Effects</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable subtle interaction sounds
                  </p>
                </div>
                <Switch 
                  onCheckedChange={(checked) => {
                    toast({
                      title: "Preference updated",
                      description: `Sound effects ${checked ? 'enabled' : 'disabled'}.`,
                      variant: "default"
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="pt-4">
          <Button 
            variant="premium"
            onClick={() => {
              toast({
                title: "Appearance settings saved",
                description: "Your appearance preferences have been updated.",
                variant: "default"
              });
            }}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </>
  );
};
