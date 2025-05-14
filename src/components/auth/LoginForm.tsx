
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { KeyIcon, Loader2, AtSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = React.memo(({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await signIn(username, password);
      toast({
        title: "Success",
        description: "You have been successfully logged in",
      });
      onSuccess();
    } catch (err) {
      console.error('Login failed:', err);
      toast({
        title: "Login Failed",
        description: typeof err === 'string' ? err : 'Invalid username or password',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [username, password, signIn, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
            required
            autoComplete="username"
            autoFocus
            disabled={isLoading}
            className="pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <KeyIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            disabled={isLoading}
            className="pl-10"
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <KeyIcon className="mr-2 h-4 w-4" />
            Sign In
          </>
        )}
      </Button>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';

export { LoginForm };
