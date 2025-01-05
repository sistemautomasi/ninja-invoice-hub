import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = useUser();
  const queryClient = useQueryClient();
  
  // Profile data query
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Settings data query
  const { data: userSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['settings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('setting_type', 'user_preference')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (newProfile: any) => {
      const { error } = await supabase
        .from('profiles')
        .update(newProfile)
        .eq('id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile settings updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile settings.",
        variant: "destructive",
      });
    },
  });

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      const { error } = await supabase
        .from('settings')
        .upsert(newSettings);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Success",
        description: "Notification settings updated successfully!",
      });
    },
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProfile = {
      full_name: formData.get('fullName'),
      phone: formData.get('phone'),
    };
    updateProfile.mutate(newProfile);
  };

  const handleNotificationToggle = async (key: string, value: boolean) => {
    updateSettings.mutate({
      setting_key: key,
      setting_value: value.toString(),
      setting_type: 'user_preference',
      user_id: user?.id,
    });
  };

  if (isProfileLoading || isSettingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    name="fullName"
                    defaultValue={profile?.full_name || ''}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500">
                    Email can only be changed through account settings
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    name="phone"
                    type="tel"
                    defaultValue={profile?.phone || ''}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive email updates about your orders</p>
                </div>
                <Switch
                  checked={userSettings?.find(s => s.setting_key === 'email_notifications')?.setting_value === 'true'}
                  onCheckedChange={(checked) => handleNotificationToggle('email_notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Order Updates</h3>
                  <p className="text-sm text-gray-500">Get notified about order status changes</p>
                </div>
                <Switch
                  checked={userSettings?.find(s => s.setting_key === 'order_updates')?.setting_value === 'true'}
                  onCheckedChange={(checked) => handleNotificationToggle('order_updates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Communications</h3>
                  <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                </div>
                <Switch
                  checked={userSettings?.find(s => s.setting_key === 'marketing_notifications')?.setting_value === 'true'}
                  onCheckedChange={(checked) => handleNotificationToggle('marketing_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Password</h3>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Change Password
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Theme</h3>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">Light</Button>
                  <Button variant="outline" className="flex-1">Dark</Button>
                  <Button variant="outline" className="flex-1">System</Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Compact Mode</h3>
                <p className="text-sm text-gray-500">
                  Make the interface more compact
                </p>
                <Switch
                  checked={userSettings?.find(s => s.setting_key === 'compact_mode')?.setting_value === 'true'}
                  onCheckedChange={(checked) => handleNotificationToggle('compact_mode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;