
import React from 'react';
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
import { Hexagon, Upload, Palette, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Branding } from '@/components/schedule/ScheduleTypes';

const brandingFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  logoType: z.enum(['default', 'text', 'image']),
  logoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
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
      primaryColor: branding.primaryColor || '#1E90FF',
      accentColor: branding.accentColor || '#0066CC',
    },
  });

  function onSubmit(data: BrandingFormValues) {
    setBranding({
      companyName: data.companyName,
      logoType: data.logoType,
      logoUrl: data.logoUrl,
      primaryColor: data.primaryColor,
      accentColor: data.accentColor,
    });
    
    toast({
      title: "Branding updated",
      description: "Your company branding has been updated successfully.",
    });
  }

  const isSuperDark = resolvedTheme === 'superdark';
  const isDark = resolvedTheme === 'dark';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Company Branding</h2>
          <p className="text-sm text-muted-foreground">
            Customize how your company brand appears throughout the application
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="mb-6">
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormItem className="flex flex-col items-center space-y-3 p-4 rounded-md border-2 border-muted hover:bg-accent/50 transition-colors">
                          <FormControl>
                            <RadioGroupItem value="default" className="sr-only" />
                          </FormControl>
                          <div className={`rounded-full border-2 border-blue-500 p-3 ${field.value === 'default' ? 'bg-blue-500/10' : ''}`}>
                            <Hexagon className={`h-6 w-6 text-blue-500`} />
                          </div>
                          <FormLabel className="font-medium cursor-pointer">Default Logo</FormLabel>
                          {field.value === 'default' && <Check className="h-4 w-4 text-green-500" />}
                        </FormItem>
                        
                        <FormItem className="flex flex-col items-center space-y-3 p-4 rounded-md border-2 border-muted hover:bg-accent/50 transition-colors">
                          <FormControl>
                            <RadioGroupItem value="text" className="sr-only" />
                          </FormControl>
                          <div className={`rounded-full border-2 border-blue-500 p-3 ${field.value === 'text' ? 'bg-blue-500/10' : ''}`}>
                            <Palette className="h-6 w-6 text-blue-500" />
                          </div>
                          <FormLabel className="font-medium cursor-pointer">Text Only</FormLabel>
                          {field.value === 'text' && <Check className="h-4 w-4 text-green-500" />}
                        </FormItem>

                        <FormItem className="flex flex-col items-center space-y-3 p-4 rounded-md border-2 border-muted hover:bg-accent/50 transition-colors">
                          <FormControl>
                            <RadioGroupItem value="image" className="sr-only" />
                          </FormControl>
                          <div className={`rounded-full border-2 border-blue-500 p-3 ${field.value === 'image' ? 'bg-blue-500/10' : ''}`}>
                            <Upload className="h-6 w-6 text-blue-500" />
                          </div>
                          <FormLabel className="font-medium cursor-pointer">Custom Image</FormLabel>
                          {field.value === 'image' && <Check className="h-4 w-4 text-green-500" />}
                        </FormItem>
                      </div>
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
                  <FormItem className="mt-6">
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: field.value || '#1E90FF' }}
                  />
                  <FormControl>
                    <Input type="color" {...field} className="w-full h-10" />
                  </FormControl>
                </div>
                <FormDescription>
                  Main brand color used for buttons and accents
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accentColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accent Color</FormLabel>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: field.value || '#0066CC' }}
                  />
                  <FormControl>
                    <Input type="color" {...field} className="w-full h-10" />
                  </FormControl>
                </div>
                <FormDescription>
                  Secondary color for highlights and special elements
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            variant="premium"
            className="mr-3"
          >
            Save Branding
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};
