
import React from 'react';
import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';

interface DemoLoginButtonProps {
  onDemoLogin: () => void;
}

const DemoLoginButton: React.FC<DemoLoginButtonProps> = React.memo(({ onDemoLogin }) => {
  return (
    <Button
      variant="outline"
      onClick={onDemoLogin}
      className="w-full flex items-center justify-center"
    >
      <Coffee className="mr-2 h-4 w-4" />
      Try Demo Mode
    </Button>
  );
});

DemoLoginButton.displayName = 'DemoLoginButton';

export { DemoLoginButton };
