
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  baseUrl: z.string().optional(),
});

interface ModelConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: string;
  onApiSubmit: (values: z.infer<typeof formSchema>) => void;
  isLocalModel?: boolean;
}

export const ModelConfigDialog: React.FC<ModelConfigDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedModel,
  onApiSubmit,
  isLocalModel = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      baseUrl: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onApiSubmit(values);
  };

  const getProviderInfo = () => {
    if (selectedModel.startsWith('gpt')) {
      return {
        name: 'OpenAI',
        docs: 'https://platform.openai.com/api-keys',
        placeholder: 'sk-...',
        needsBaseUrl: false,
      };
    }
    if (selectedModel.startsWith('claude')) {
      return {
        name: 'Anthropic',
        docs: 'https://console.anthropic.com/settings/keys',
        placeholder: 'sk-ant-...',
        needsBaseUrl: false,
      };
    }
    return {
      name: 'Provider',
      docs: '#',
      placeholder: 'API Key',
      needsBaseUrl: true,
    };
  };

  const provider = getProviderInfo();

  if (isLocalModel) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border-gray-700 text-gray-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Local LLM Configuration</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure your local language model settings in the main settings panel.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} className="bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-gray-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{selectedModel} Configuration</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your {provider.name} API key to use {selectedModel}.
            <a 
              href={provider.docs} 
              target="_blank" 
              rel="noreferrer"
              className="ml-1 text-blue-400 hover:text-blue-300"
            >
              Get API key
            </a>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={provider.placeholder}
                      type="password" 
                      className="bg-gray-800 border-gray-700 text-gray-200"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {provider.needsBaseUrl && (
              <FormField
                control={form.control}
                name="baseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://api.example.com" 
                        className="bg-gray-800 border-gray-700 text-gray-200"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)} 
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
