
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Lock, ArrowRight, AlertCircle, Shield, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Logo } from '@/components/Logo';
import { localAuth } from '@/services/localAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenEmail, setTokenEmail] = useState<string | undefined>();
  
  const token = searchParams.get('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false);
        setTokenValid(false);
        setResetError('Invalid reset token. Please request a new password reset link.');
        return;
      }

      try {
        const { data, error } = await localAuth.validateResetToken({ token });
        
        if (error || !data.valid) {
          throw new Error('Invalid or expired reset token');
        }
        
        setTokenValid(true);
        setTokenEmail(data.email);
      } catch (error) {
        const validationError = error as Error;
        setTokenValid(false);
        setResetError(validationError.message || 'Invalid or expired reset token');
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      setResetError('Invalid reset token');
      return;
    }
    
    setIsLoading(true);
    setResetError(null);
    
    try {
      const { data, error } = await localAuth.resetPassword({
        token,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.success) {
        setResetSuccess(true);
        
        toast({
          title: "Password reset successful",
          description: "Your password has been reset. You can now log in with your new password.",
        });
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      // Handle errors
      const resetError = error as Error;
      setResetError(resetError.message || 'Failed to reset your password. Please try again.');
      
      toast({
        title: "Password reset failed",
        description: resetError.message || "Failed to reset your password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#080a0c] dark:to-[#111418]">
        <Card className="w-full max-w-md shadow-lg border-opacity-50 p-8">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-medium">Validating reset token...</h2>
            <p className="text-sm text-muted-foreground mt-2">Please wait while we validate your reset token.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#080a0c] dark:to-[#111418]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-center mt-6">Reset Your Password</h1>
          <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
            {tokenValid ? 'Enter your new password below' : 'Invalid reset token'}
          </p>
        </div>
        
        <Card className="shadow-lg border-opacity-50">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>{resetSuccess ? 'Password Changed' : 'Create New Password'}</CardTitle>
            </div>
            {tokenValid && tokenEmail && (
              <CardDescription className="text-center">
                {resetSuccess ? 'Your password has been reset successfully' : `For account ${tokenEmail}`}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {resetError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{resetError}</AlertDescription>
              </Alert>
            )}
            
            {tokenValid && !resetSuccess ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Enter your new password" 
                              type="password"
                              className="pl-10" 
                              autoComplete="new-password"
                              disabled={isLoading}
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Confirm your new password" 
                              type="password"
                              className="pl-10" 
                              autoComplete="new-password"
                              disabled={isLoading}
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                    {!isLoading && <ArrowRight className="ml-1 h-4 w-4" />}
                  </Button>
                </form>
              </Form>
            ) : resetSuccess ? (
              <div className="space-y-4">
                <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <div>
                      <h4 className="font-medium">Password reset successful!</h4>
                      <p className="text-sm opacity-80 mt-1">
                        Your password has been reset successfully. You can now log in with your new password.
                      </p>
                    </div>
                  </div>
                </Alert>
                
                <Button 
                  type="button"
                  className="w-full mt-4" 
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {resetError || "Invalid or expired reset token. Please request a new password reset link."}
                  </AlertDescription>
                </Alert>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full mt-4" 
                  onClick={() => navigate('/forgot-password')}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Request New Reset Link
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
