
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import ProductionReadiness from '@/components/ProductionReadiness';
import { ArrowLeft, Download, Server } from 'lucide-react';

const Production = () => {
  const { user, isLoading, isDemoMode } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Only show production info for logged in users
  if (!user && !isDemoMode) {
    navigate('/login');
    return null;
  }

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
          <h2 className="text-xl font-semibold mb-4">Deployment Instructions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Web Deployment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Run the following command to build the production version of your app:
              </p>
              <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                npm run build
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Mobile Deployment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                To deploy to mobile platforms:
              </p>
              <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                npx cap sync<br />
                npx cap open ios # For iOS<br />
                npx cap open android # For Android
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Electron Desktop App</h3>
              <p className="text-sm text-muted-foreground mt-1">
                To build the desktop application:
              </p>
              <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
                npm run build<br />
                npx electron-builder build
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Production;
