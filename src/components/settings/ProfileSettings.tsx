
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { localAuth } from '@/services/localAuth';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, User } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProfileSettings() {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    username: user?.user_metadata?.username || '',
    dashboardLayout: user?.user_metadata?.display_preferences?.dashboard_layout || 'default'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLayoutChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      dashboardLayout: value as 'default' | 'compact' | 'expanded'
    }));
  };
  
  const handleSaveChanges = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { data, error } = await localAuth.updateUser({
        user_metadata: {
          ...user.user_metadata,
          full_name: formData.fullName,
          username: formData.username,
          display_preferences: {
            ...user.user_metadata?.display_preferences,
            dashboard_layout: formData.dashboardLayout
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Profile picture must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload the avatar
      const uploadResult = await localAuth.uploadAvatar(file);
      
      if (uploadResult.error) throw uploadResult.error;
      if (!uploadResult.data) throw new Error("No data returned from upload");
      
      // Update the user profile with the new avatar URL
      const { error } = await localAuth.updateUser({
        user_metadata: {
          ...user?.user_metadata,
          avatar_url: uploadResult.data.url
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const getInitials = () => {
    const fullName = user?.user_metadata?.full_name || user?.email || '';
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Profile Settings</h3>
      <p className="text-sm text-muted-foreground">
        Customize your personal profile and dashboard preferences
      </p>
      
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative">
              <Avatar 
                className="h-24 w-24 cursor-pointer ring-2 ring-primary ring-offset-2 ring-offset-background"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
              </Avatar>
              
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
              
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={handleAvatarClick}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="space-y-2 flex-1 text-center sm:text-left">
              <h4 className="text-lg font-medium">
                {user?.user_metadata?.full_name || 'User'}
              </h4>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(user?.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="dashboardLayout">Dashboard Layout</Label>
            <Select
              value={formData.dashboardLayout}
              onValueChange={handleLayoutChange}
            >
              <SelectTrigger id="dashboardLayout" className="mt-1 w-full">
                <SelectValue placeholder="Select layout preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="expanded">Expanded</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Choose how you'd like your dashboard to be displayed
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handleSaveChanges} 
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
