
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppContext } from '@/context/AppContext';
import { Hexagon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const brandingFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  logoType: z.enum(['default', 'text', 'image']),
  logoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
});

type BrandingFormValues = z.infer<typeof brandingFormSchema>;

export const BrandingSettingsTab = () => {
  const { branding, setBranding } = useAppContext();
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  
  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingFormSchema),
    defaultValues: {
      companyName: branding.companyName || 'Northwestern Automation',
      logoType: branding.logoType || 'default',
      logoUrl: branding.logoUrl || '',
    },
  });

  function onSubmit(data: BrandingFormValues) {
    setBranding({
      companyName: data.companyName,
      logoType: data.logoType,
      logoUrl: data.logoUrl,
    });
    
    toast({
      title: "Branding updated",
      description: "Your company branding has been updated successfully.",
    });
  }

  // Use blue colors consistently in both themes
  const borderColor = 'border-blue-500';
  const iconColor = 'text-blue-500';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your company name" {...field} />
              </FormControl>
              <FormDescription>
                This name will appear in the sidebar, header, and documents.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logoType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Logo Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="default" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-2">
                      <div className={`rounded-full border-2 ${borderColor} p-1`}>
                        <Hexagon className={`h-4 w-4 ${iconColor}`} />
                      </div>
                      Default Logo
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="text" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Text Only (No Logo)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="image" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Custom Image
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('logoType') === 'image' && (
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/logo.png" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the URL of your company logo. Recommended size: 64x64px.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="pt-2">
          <Button type="submit">Save Branding</Button>
        </div>
      </form>
    </Form>
  );
};
