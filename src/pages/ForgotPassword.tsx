
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { User, ArrowRight, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Logo } from '@/components/Logo';
import { localAuth } from '@/services/localAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Please enter a valid username' }),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [resetRequested, setResetRequested] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setRequestError(null);
    
    try {
      const { data, error } = await localAuth.requestPasswordReset({
        username: values.username,
      });
      
      if (error) {
        throw error;
      }
      
      // Always show success, even if username doesn't exist (for security reasons)
      setResetRequested(true);
      
      toast({
        title: "Reset request sent",
        description: "Check the console for reset instructions (in a real app, this would be sent to your contact method).",
      });
    } catch (error) {
      // Handle errors
      const authError = error as Error;
      setRequestError(authError.message || 'Failed to process your request. Please try again.');
      
      toast({
        title: "Request failed",
        description: authError.message || "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#080a0c] dark:to-[#111418]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-center mt-6">Password Recovery</h1>
          <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
            Enter your username to receive password reset instructions
          </p>
        </div>
        
        <Card className="shadow-lg border-opacity-50">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Reset Password</CardTitle>
            </div>
            <CardDescription className="text-center">
              {!resetRequested 
                ? "Enter your username to receive recovery instructions" 
                : "Check for reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requestError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{requestError}</AlertDescription>
              </Alert>
            )}
            
            {!resetRequested ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Enter your username" 
                              className="pl-10" 
                              autoComplete="username"
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
                    {isLoading ? "Processing..." : "Reset Password"}
                    {!isLoading && <ArrowRight className="ml-1 h-4 w-4" />}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                  <div className="flex flex-col space-y-2">
                    <h4 className="font-medium">Recovery information sent!</h4>
                    <p className="text-sm opacity-80">
                      Check your console for instructions to reset your password.
                      <br />
                      <small className="text-xs">(In a real app, this would be sent to your contact method)</small>
                    </p>
                  </div>
                </Alert>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full mt-4" 
                  onClick={() => navigate('/login')}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Return to Login
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {!resetRequested ? (
                <>
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Log In
                  </Link>
                </>
              ) : (
                <>
                  Didn't receive instructions?{" "}
                  <button 
                    onClick={() => setResetRequested(false)}
                    className="text-primary hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
                  >
                    Try again
                  </button>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
