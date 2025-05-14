
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DemoLoginButtonProps {
  onDemoLogin: () => void;
}

export const DemoLoginButton = ({ onDemoLogin }: DemoLoginButtonProps) => {
  const { toast } = useToast();

  const handleDemoLogin = () => {
    toast({
      title: "Demo Mode Active",
      description: "You are browsing in demo mode. Data will not be saved.",
    });
    
    onDemoLogin();
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full relative overflow-hidden group transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 dark:from-[#1A1F2C] dark:to-[#221F26] dark:hover:from-[#262B38] dark:hover:to-[#2E2B33] border-gray-300 dark:border-gray-700"
      onClick={handleDemoLogin}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent shine-effect"></div>
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 text-[#33C3F0] dark:text-[#4284fd]" />
        <span className="text-gray-800 dark:text-gray-200">Try Demo Preview</span>
      </div>
    </Button>
  );
};
