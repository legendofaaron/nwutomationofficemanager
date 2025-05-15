
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { LoginHeader } from '@/components/auth/LoginHeader';
import { LoginForm } from '@/components/auth/LoginForm';
import { DemoLoginButton } from '@/components/auth/DemoLoginButton';
import { useSessionValidator } from '@/hooks/useSessionValidator';

const Login = () => {
  const navigate = useNavigate();
  const { branding } = useAppContext();
  const { setDemoMode } = useAuth();
  
  // Check if user is already logged in
  useSessionValidator();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  // Function to handle demo login
  const handleDemoLogin = () => {
    // Enable demo mode in the auth context
    setDemoMode(true);
    
    // Navigate to dashboard with demo mode enabled
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#080a0c] dark:to-[#111418]">
      <div className="w-full max-w-md">
        <LoginHeader companyName={branding.companyName} />
        
        <Card className="shadow-lg border-opacity-50">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Welcome to Schedule Builder</CardTitle>
            </div>
            <CardDescription className="text-center">
              Sign in to create and manage your schedules with our drag-and-drop interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={handleLoginSuccess} />
            
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-card text-muted-foreground">OR</span>
              </div>
            </div>
            
            <div className="mt-6 pt-2">
              <DemoLoginButton onDemoLogin={handleDemoLogin} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Shield className="inline h-3 w-3 mr-1" /> 
            Schedule Builder - Create beautiful schedules with ease
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
