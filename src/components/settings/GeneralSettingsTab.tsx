
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Switch } from '@/components/ui/switch';

const generalFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  companyAddress: z.string().optional(),
  emailSignature: z.string().optional(),
  enableNotifications: z.boolean().default(true),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

const defaultValues: Partial<GeneralFormValues> = {
  companyName: "Acme Corporation",
  companyAddress: "123 Business Ave, Suite 200, Corporate City",
  emailSignature: "Regards,\nThe Acme Team",
  enableNotifications: true,
};

export const GeneralSettingsTab = () => {
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues,
  });

  function onSubmit(data: GeneralFormValues) {
    toast({
      title: "Settings updated",
      description: "Your system settings have been saved.",
    });
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormDescription>
                This name will appear on all documents and communications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="companyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter company address"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This address will be used for official documents.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emailSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Email Signature</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter default email signature"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="enableNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Desktop Notifications
                </FormLabel>
                <FormDescription>
                  Receive notifications for important events.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};
