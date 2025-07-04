
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { LoginHeader } from '@/components/auth/LoginHeader';
import { LoginForm } from '@/components/auth/LoginForm';
import { DemoLoginButton } from '@/components/auth/DemoLoginButton';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { branding } = useAppContext();
  const { setDemoMode, session } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Check if user is already logged in and redirect to dashboard
  useEffect(() => {
    // Prevent redirect loops by using a flag
    if (session && !isRedirecting) {
      setIsRedirecting(true);
      const returnTo = location.state?.returnTo || '/dashboard';
      navigate(returnTo, { replace: true });
    }
  }, [session, navigate, location, isRedirecting]);

  const handleLoginSuccess = () => {
    const returnTo = location.state?.returnTo || '/dashboard';
    navigate(returnTo, { replace: true });
  };

  // Function to handle demo login
  const handleDemoLogin = () => {
    // Enable demo mode in the auth context
    setDemoMode(true);
    
    // Navigate to dashboard with demo mode enabled
    navigate('/dashboard', { replace: true });
  };

  // If already authenticated, don't render login form
  if (session) {
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#080a0c] dark:to-[#111418]">
      <div className="w-full max-w-md">
        <LoginHeader companyName={branding.companyName} />
        
        <Card className="shadow-lg border-opacity-50">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Secure Login</CardTitle>
            </div>
            <CardDescription className="text-center">
              Enter your username and password to access your account
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
            Offline mode enabled - Your data is stored locally
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
