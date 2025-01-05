import { useUser } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AppearanceSettings = () => {
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
        description: "Appearance settings updated successfully!",
      });
    },
  });

  const handleCompactModeToggle = async (checked: boolean) => {
    updateSettings.mutate({
      setting_key: 'compact_mode',
      setting_value: checked.toString(),
      setting_type: 'user_preference',
      user_id: user?.id,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">Theme</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="outline" className="flex-1">Light</Button>
            <Button variant="outline" className="flex-1">Dark</Button>
            <Button variant="outline" className="flex-1">System</Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium">Compact Mode</h3>
            <p className="text-sm text-gray-500">
              Make the interface more compact
            </p>
          </div>
          <Switch
            checked={userSettings?.find(s => s.setting_key === 'compact_mode')?.setting_value === 'true'}
            onCheckedChange={handleCompactModeToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};