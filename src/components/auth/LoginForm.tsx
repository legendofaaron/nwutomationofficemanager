
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { KeyIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = React.memo(({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Success",
        description: "You have been successfully logged in",
      });
      onSuccess();
    } catch (err) {
      console.error('Login failed:', err);
      toast({
        title: "Login Failed",
        description: typeof err === 'string' ? err : 'Invalid email or password',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, signIn, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="name@example.com"
          required
          autoComplete="email"
          autoFocus
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot Password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          disabled={isLoading}
        />
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
