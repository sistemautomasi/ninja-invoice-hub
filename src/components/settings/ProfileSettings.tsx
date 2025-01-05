import { useUser } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ProfileSettings = () => {
  const { toast } = useToast();
  const user = useUser();
  const queryClient = useQueryClient();

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProfile = {
      full_name: formData.get('fullName'),
      phone: formData.get('phone'),
    };
    updateProfile.mutate(newProfile);
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
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
              className="w-full md:w-2/3"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full md:w-2/3 bg-gray-50"
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
              className="w-full md:w-2/3"
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
  );
};