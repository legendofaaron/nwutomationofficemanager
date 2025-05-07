
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Code, Download, File, FileText, Globe, Heart, Mail } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const OpenSourceInfo = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  const handleOpenGithub = () => {
    window.open('https://github.com/lovable-labs/office-manager', '_blank');
  };

  const handleDownloadSource = () => {
    window.open('https://github.com/lovable-labs/office-manager/archive/refs/heads/main.zip', '_blank');
  };

  const handleViewLicense = () => {
    window.open('https://opensource.org/licenses/MIT', '_blank');
  };
  
  const handleEmailDeveloper = () => {
    window.location.href = 'mailto:northwesternautomation@gmail.com?subject=Office%20Manager%20Source%20Code%20Request&body=I%20would%20like%20to%20request%20the%20source%20code%20for%20Office%20Manager.';
  };

  const handleTipDeveloper = () => {
    window.open('https://paypal.me/aaronthelegend', '_blank');
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-green-600" />
            <CardTitle>Open Source Information</CardTitle>
          </div>
          <CardDescription>
            This application is free and open-source software
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">MIT License</h3>
            <p className="text-sm text-muted-foreground">
              Office Manager is licensed under the MIT License, which means you are free to:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                <span>Use for commercial or personal projects</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                <span>Modify and distribute the source code</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                <span>Include in proprietary software</span>
              </li>
            </ul>
          </div>
          
          <div className="pt-2">
            <h3 className="font-medium mb-2">Source Code</h3>
            <p className="text-sm text-muted-foreground">
              The complete source code is freely available on GitHub. You can view, fork, 
              or contribute to the project.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleOpenGithub}
          >
            <Github className="h-4 w-4" /> View Source
          </Button>
          <Button 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleDownloadSource}
          >
            <Download className="h-4 w-4" /> Download Source
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={handleViewLicense}
          >
            <FileText className="h-4 w-4" /> View License
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-amber-600" />
            <CardTitle>Contact & Support</CardTitle>
          </div>
          <CardDescription>
            Get in touch for the source code or support the developer
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Enjoying Office Manager? Contact the developer directly to request the complete source code 
            or consider supporting the project with a small tip.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-2">
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleEmailDeveloper}
          >
            <Mail className="h-4 w-4" /> Email for Source Code
          </Button>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
            onClick={handleTipDeveloper}
          >
            <Heart className="h-4 w-4" fill="currentColor" /> Tip Developer on PayPal
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
