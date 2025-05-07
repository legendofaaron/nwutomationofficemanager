
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Code, Download, File, FileText, Globe } from 'lucide-react';
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

  return (
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
  );
};
