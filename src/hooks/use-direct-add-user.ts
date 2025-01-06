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
      if (!user) {
        throw new Error('You must be logged in to perform this action');
      }

      // First check if the user has admin role
      const { data: adminCheck, error: adminCheckError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (adminCheckError) throw adminCheckError;
      if (!adminCheck || adminCheck.role !== 'admin') {
        throw new Error('Only admins can add users');
      }

      const profileId = crypto.randomUUID();

      // Create a profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: profileId, email }]);
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create profile');
      }

      // Create the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ user_id: profileId, role }]);

      if (roleError) {
        console.error('Role creation error:', roleError);
        // Clean up the profile if role creation fails
        await supabase.from('profiles').delete().eq('id', profileId);
        throw new Error('Failed to assign role');
      }

      // Fetch and return the created profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select()
        .eq('id', profileId)
        .single();

      if (fetchError) throw fetchError;
      return profile;
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