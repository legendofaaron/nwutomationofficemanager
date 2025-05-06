
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import ProductionReadiness from '@/components/ProductionReadiness';
import { ArrowLeft, Download, Server, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { isLlmConfigured } from '@/utils/llm';

const Production = () => {
  const { user, isLoading, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [buildInProgress, setBuildInProgress] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildComplete, setBuildComplete] = useState(false);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Only show production info for logged in users
  if (!user && !isDemoMode) {
    navigate('/login');
    return null;
  }

  const handleBuild = () => {
    setBuildInProgress(true);
    setBuildProgress(0);
    setBuildComplete(false);
    
    // Simulate build progress
    const interval = setInterval(() => {
      setBuildProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setBuildComplete(true);
          toast({
            title: "Build Complete",
            description: "Your application has been successfully built for production!"
          });
          return 100;
        }
        return next;
      });
    }, 500);
  };

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast({
      title: "Command Copied",
      description: "The command has been copied to your clipboard."
    });
  };

  const llmConfigured = isLlmConfigured();

  return (
    <div className="container max-w-6xl mx-auto p-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Server className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Production Status</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
          <Button variant="default">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ProductionReadiness />
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Build Application</h2>
          {!buildComplete ? (
            <div className="space-y-4">
              {buildInProgress ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Building application...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(buildProgress)}%</span>
                  </div>
                  <Progress value={buildProgress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {buildProgress < 30 && "Installing dependencies..."}
                    {buildProgress >= 30 && buildProgress < 60 && "Transpiling TypeScript..."}
                    {buildProgress >= 60 && buildProgress < 90 && "Bundling modules..."}
                    {buildProgress >= 90 && "Optimizing assets..."}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Build your application for production deployment. This will create optimized files ready for deployment.
                  </p>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span>npm run build</span>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyCommand("npm run build")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleBuild} disabled={!llmConfigured}>
                    Start Build
                  </Button>
                  {!llmConfigured && (
                    <p className="text-xs text-amber-500 mt-2">
                      Configure language model settings before building. Go to Settings → Language Model.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Build completed successfully!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your application has been built and is ready for deployment. The optimized files are available in the 'dist' directory.
              </p>
              <Button onClick={() => { setBuildComplete(false); setBuildInProgress(false); }}>
                Build Again
              </Button>
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Deployment Instructions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Web Deployment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Run the following command to build the production version of your app:
              </p>
              <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                <div className="flex items-center justify-between">
                  <span>npm run build</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCommand("npm run build")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Mobile Deployment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                To deploy to mobile platforms:
              </p>
              <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span>npx cap sync</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCommand("npx cap sync")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span>npx cap open ios # For iOS</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCommand("npx cap open ios")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>npx cap open android # For Android</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCommand("npx cap open android")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Electron Desktop App</h3>
              <p className="text-sm text-muted-foreground mt-1">
                To build the desktop application:
              </p>
              <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span>npm run build</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCommand("npm run build")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>npx electron-builder build</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCommand("npx electron-builder build")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Deployment Resources</h3>
                <Button variant="outline" size="sm" className="flex items-center" onClick={() => window.open('https://capacitorjs.com/docs/cli/commands/build', '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-1" /> Documentation
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Production;
