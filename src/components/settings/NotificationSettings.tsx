import { useUser } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const user = useUser();
  const queryClient = useQueryClient();

  const { data: userSettings } = useQuery({
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

  const handleNotificationToggle = async (key: string, value: boolean) => {
    updateSettings.mutate({
      setting_key: key,
      setting_value: value.toString(),
      setting_type: 'user_preference',
      user_id: user?.id,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive email updates about your orders</p>
          </div>
          <Switch
            checked={userSettings?.find(s => s.setting_key === 'email_notifications')?.setting_value === 'true'}
            onCheckedChange={(checked) => handleNotificationToggle('email_notifications', checked)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium">Order Updates</h3>
            <p className="text-sm text-gray-500">Get notified about order status changes</p>
          </div>
          <Switch
            checked={userSettings?.find(s => s.setting_key === 'order_updates')?.setting_value === 'true'}
            onCheckedChange={(checked) => handleNotificationToggle('order_updates', checked)}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
  );
};