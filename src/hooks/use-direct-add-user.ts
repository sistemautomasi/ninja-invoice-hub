import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { useUser } from "@supabase/auth-helpers-react";

type UserRole = Database["public"]["Enums"]["user_role"];

export const useDirectAddUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = useUser();

  const addUser = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: UserRole }) => {
      console.log("Current user:", user); // Debug log

      if (!user) {
        console.error("No user found in auth state");
        throw new Error('You must be logged in to perform this action');
      }

      // Check admin role with detailed error logging
      const { data: adminCheck, error: adminCheckError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (adminCheckError) {
        console.error('Admin check error:', adminCheckError);
        throw adminCheckError;
      }

      console.log("Admin check result:", adminCheck); // Debug log

      if (!adminCheck || adminCheck.role !== 'admin') {
        console.error('User is not an admin:', adminCheck);
        throw new Error('Only admins can add users');
      }

      const profileId = crypto.randomUUID();
      console.log("Generated profile ID:", profileId); // Debug log

      // Create profile with error details
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

      console.log("Profile created:", profileData); // Debug log

      // Create user role with error details
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

  return { addUser };
};