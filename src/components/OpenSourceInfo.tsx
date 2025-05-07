
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Heart, Github, Download, Code, GitFork } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Logo } from '@/components/Logo';
import { Separator } from '@/components/ui/separator';

export const OpenSourceInfo = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  const handleEmailDeveloper = () => {
    window.location.href = 'mailto:contact@example.com?subject=Office%20Manager%20Source%20Code%20Request&body=I%20would%20like%20to%20request%20the%20source%20code%20for%20Office%20Manager.';
  };
  
  const handleGitHubRedirect = () => {
    window.open('https://github.com/legendofaaron/nwutomationofficemanager', '_blank');
  };

  return (
    <div className="space-y-6">
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-amber-600" />
            <CardTitle>Contact for Source Code</CardTitle>
          </div>
          <CardDescription>
            Get in touch for the source code or support
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Enjoying Office Manager? Contact us directly to request the complete source code.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-2">
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleEmailDeveloper}
          >
            <Mail className="h-4 w-4" /> Email for Source Code
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-blue-600" />
              <CardTitle>GitHub Repository</CardTitle>
            </div>
            <Logo small />
          </div>
          <CardDescription>
            Download, customize, and contribute to Office Manager
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-3">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Download className="h-4 w-4 text-blue-500" /> How to Download
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="mb-2">Clone the repository to your local machine:</p>
                <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md text-xs overflow-x-auto">
                  git clone https://github.com/legendofaaron/nwutomationofficemanager.git
                </pre>
                <p>Or download directly as a ZIP file from the GitHub repository.</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Code className="h-4 w-4 text-blue-500" /> Customization Guide
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Customize Office Manager for your company:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Modify branding in <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">src/components/Logo.tsx</code> and theme settings</li>
                  <li>Update employee features in <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">src/components/EmployeesView.tsx</code></li>
                  <li>Adjust invoice templates and client management</li>
                  <li>Extend the knowledge base with company-specific data</li>
                </ol>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <GitFork className="h-4 w-4 text-blue-500" /> How to Contribute
              </h3>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">To contribute improvements:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Fork the repository on GitHub</li>
                  <li>Create a feature branch: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">git checkout -b feature/your-feature</code></li>
                  <li>Commit your changes and push to your fork</li>
                  <li>Open a pull request to the main repository</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={handleGitHubRedirect}
          >
            <Github className="h-4 w-4" /> View on GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
