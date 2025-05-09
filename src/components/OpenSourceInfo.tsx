
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Heart, Github, Download, Code } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Logo } from '@/components/Logo';
import { Separator } from '@/components/ui/separator';

export const OpenSourceInfo = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  const handleContactDeveloper = () => {
    window.location.href = 'mailto:contact@example.com?subject=Office%20Manager%20Feedback&body=I%20have%20some%20feedback%20about%20Office%20Manager.';
  };
  
  const handleSupportDevelopment = () => {
    window.open('https://ko-fi.com/officemanager', '_blank');
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            <CardTitle>Office Manager - 100% Free Software</CardTitle>
          </div>
          <CardDescription>
            Free desktop and web application for office management
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Office Manager is completely free software that helps you manage your office efficiently. 
              All features are available at no cost, including:
            </p>
            
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Document management with AI assistance</li>
              <li>Knowledge base building and maintenance</li>
              <li>Office scheduling and team coordination</li>
              <li>AI-powered productivity tools</li>
            </ul>

            <Separator />

            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Code className="h-4 w-4 text-blue-500" /> Customization Options
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Customize Office Manager for your company:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Modify branding and theme settings</li>
                  <li>Update employee features</li>
                  <li>Adjust invoice templates and client management</li>
                  <li>Extend the knowledge base with company-specific data</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="p-4 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20 w-full">
            <h3 className="font-medium mb-2 flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" fill="currentColor" /> 
              Support Development
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you find Office Manager useful, please consider supporting its development.
            </p>
            <div className="flex gap-2">
              <Button 
                className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
                onClick={handleSupportDevelopment}
              >
                <Heart className="h-4 w-4" fill="currentColor" /> Support With A Tip
              </Button>
              
              <Button 
                variant="outline"
                className="flex items-center gap-1" 
                onClick={handleContactDeveloper}
              >
                <Mail className="h-4 w-4" /> Send Feedback
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
