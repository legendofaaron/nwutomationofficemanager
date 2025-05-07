
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Heart } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const OpenSourceInfo = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  const handleEmailDeveloper = () => {
    window.location.href = 'mailto:northwesternautomation@gmail.com?subject=Office%20Manager%20Source%20Code%20Request&body=I%20would%20like%20to%20request%20the%20source%20code%20for%20Office%20Manager.';
  };

  const handleTipMe = () => {
    window.open('https://paypal.me/aaronthelegend', '_blank');
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
            onClick={handleTipMe}
          >
            <Heart className="h-4 w-4" fill="currentColor" /> Tip Developer on PayPal
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
