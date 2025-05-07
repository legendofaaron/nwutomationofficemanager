import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { localAuth } from '@/services/localAuth';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, User, Mail, Calendar, Shield, LogOut } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '@/components/UserAvatar';

export function ProfileSettings() {
  const { user, session, signOut, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    username: user?.user_metadata?.username || '',
    dashboardLayout: user?.user_metadata?.display_preferences?.dashboard_layout || 'default',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    jobTitle: user?.user_metadata?.job_title || '',
  });
  
  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user?.user_metadata?.full_name || '',
        username: user?.user_metadata?.username || '',
        dashboardLayout: user?.user_metadata?.display_preferences?.dashboard_layout || 'default',
        bio: user?.user_metadata?.bio || '',
        location: user?.user_metadata?.location || '',
        jobTitle: user?.user_metadata?.job_title || '',
      });
    }
  }, [user]);
  
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
          bio: formData.bio,
          location: formData.location,
          job_title: formData.jobTitle,
          display_preferences: {
            ...user.user_metadata?.display_preferences,
            dashboard_layout: formData.dashboardLayout
          }
        }
      });
      
      if (error) throw error;
      
      // Refresh user data after update
      refreshUser();
      
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
      
      // Refresh user data after update
      refreshUser();
      
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
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Profile Settings</h3>
          <p className="text-sm text-muted-foreground">
            View and manage your profile information
          </p>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full sm:w-auto"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4">
          <Card className="p-6">
            <div className="mb-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative">
                  <UserAvatar 
                    className="h-24 w-24 cursor-pointer ring-2 ring-primary ring-offset-2 ring-offset-background"
                    onClick={handleAvatarClick}
                  />
                  
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
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    @{user?.user_metadata?.username}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Member since {new Date(user?.created_at || '').toLocaleDateString()}
                  </p>
                  <p className="text-xs text-primary flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Account in good standing
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
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    placeholder="Your job title"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  placeholder="Tell us a bit about yourself"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Brief description for your profile
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
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card className="p-6">
            <h4 className="text-lg font-medium mb-4">Display Preferences</h4>
            <div className="space-y-4">
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
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card className="p-6">
            <h4 className="text-lg font-medium mb-4">Account Security</h4>
            <div className="space-y-4">
              <p className="text-sm">
                For security reasons, password changes are currently managed through a separate process.
                For assistance with password changes, please contact support.
              </p>
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out of All Devices
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
