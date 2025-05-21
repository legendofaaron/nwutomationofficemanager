
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';

// API key configuration schema
const apiFormSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  baseUrl: z.string().optional(),
});

interface ModelConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: string;
  onApiSubmit: (values: z.infer<typeof apiFormSchema>) => void;
  isLocalModel: boolean;
}

export const ModelConfigDialog: React.FC<ModelConfigDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  selectedModel,
  onApiSubmit,
  isLocalModel
}) => {
  // Form for API key configuration
  const form = useForm({
    resolver: zodResolver(apiFormSchema),
    defaultValues: {
      apiKey: "",
      baseUrl: "",
    },
  });

  // Get placeholder text based on model type
  const getApiFieldPlaceholder = () => {
    if (selectedModel.includes('gpt')) return 'sk-...';
    if (selectedModel.includes('claude')) return 'sk-ant-...';
    if (selectedModel.includes('gemini')) return 'aig-...';
    return 'API key';
  };
  
  // Check if URL field should be visible
  const getUrlFieldVisible = () => {
    return !selectedModel.includes('gpt') && 
           !selectedModel.includes('claude') && 
           !selectedModel.includes('gemini');
  };

  const handleOpenSettings = () => {
    onOpenChange(false);
    toast({
      title: "Local model settings",
      description: "In a full implementation, this would open the local model configuration."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure {selectedModel}</DialogTitle>
        </DialogHeader>
        
        {isLocalModel ? (
          <div className="py-4 space-y-4">
            <p className="text-sm">
              To configure {selectedModel}, please visit the settings page and set up your local language model.
            </p>
            <Button onClick={handleOpenSettings}>
              Open Settings
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onApiSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={getApiFieldPlaceholder()} 
                        type="password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {getUrlFieldVisible() && (
                <FormField
                  control={form.control}
                  name="baseUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://api.example.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
