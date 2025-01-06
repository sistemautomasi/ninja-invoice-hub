import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

type UserRole = Database["public"]["Enums"]["user_role"];

export const useDirectAddUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        console.log("No user found in auth state");
        return;
      }

      console.log("Checking admin status for user:", user.email);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .single();

      if (profileError) {
        console.error('Profile check error:', profileError);
        return;
      }

      console.log("Profile data:", profileData);

      if (!profileData?.id) {
        console.log("No profile found for user");
        return;
      }

      const { data: adminCheck, error: adminCheckError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profileData.id)
        .single();

      if (adminCheckError) {
        console.error('Admin check error:', adminCheckError);
        return;
      }

      console.log("Admin check result:", adminCheck);
      setIsAdmin(adminCheck?.role === 'admin');
    };

    checkAdminStatus();
  }, [user]);

  const addUser = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: UserRole }) => {
      if (!user) {
        console.error("No user found in auth state");
        throw new Error('You must be logged in to perform this action');
      }

      if (!isAdmin) {
        console.error('User is not an admin');
        throw new Error('Only admins can add users');
      }

      const profileId = crypto.randomUUID();
      console.log("Generated profile ID:", profileId);

      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: profileId, 
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      console.log("Profile created:", profileData);

      // Create user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ 
          user_id: profileId, 
          role,
          created_at: new Date().toISOString()
        }]);

      if (roleError) {
        console.error('Role creation error:', roleError);
        // Clean up the profile if role creation fails
        await supabase.from('profiles').delete().eq('id', profileId);
        throw new Error(`Failed to assign role: ${roleError.message}`);
      }

      return profileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Success",
        description: "User added successfully!",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user.",
        variant: "destructive",
      });
    },
  });

  return { addUser, isAdmin };
};