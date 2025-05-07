
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { DemoModeRedirect } from './DemoModeRedirect';
import { Shield, CheckCircle, Mail, Heart } from 'lucide-react';

const PaymentPage = () => {
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleContinue = () => {
    toast({
      title: "Thank you for using Office Manager",
      description: "All features are completely free.",
      variant: "default",
    });
    navigate('/dashboard');
  };

  const handleEmailDeveloper = () => {
    window.location.href = 'mailto:contact@example.com?subject=Office%20Manager%20Feedback&body=I%20have%20some%20feedback%20about%20Office%20Manager.';
  };
  
  const handleTipMe = () => {
    window.open('https://ko-fi.com/officemanager', '_blank');
  };

  return (
    <>
      {/* Redirect to dashboard if in demo mode */}
      <DemoModeRedirect />
      
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#080a0c] dark:to-[#111418]">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <Logo />
            <h1 className="mt-6 text-2xl font-bold">Office Manager</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              100% Free Software
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              All Features Included for Free
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Web Application Features:
                </p>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Full access to all AI features and training capabilities</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Knowledge base training and document generation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Advanced customization and integration options</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Desktop Application Features:
                </p>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Full offline functionality</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use your own local LLMs</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unlimited access to desktop application</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/70">
              <h3 className="font-medium mb-2 flex items-center text-gray-700 dark:text-gray-300">
                <Heart className="h-4 w-4 mr-2 text-gray-500" /> 
                Supporting Development
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Office Manager is completely free to use.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                  onClick={handleTipMe}
                >
                  <Heart className="h-3 w-3 mr-1 text-gray-400" /> Support
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100/50 dark:hover:bg-gray-700/50" 
                  onClick={handleEmailDeveloper}
                >
                  <Mail className="h-3 w-3 mr-1 text-gray-400" /> Contact
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                className="w-full max-w-xs" 
                onClick={handleContinue}
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <Shield className="inline h-3 w-3 mr-1" /> 
              Secure and private
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
