import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

export const useDirectAddUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addUser = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: UserRole }) => {
      // Create a profile for the user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: crypto.randomUUID(), email }])
        .select()
        .single();
      
      if (profileError) throw profileError;

      // Create the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ user_id: profile.id, role }]);

      if (roleError) throw roleError;
      return { success: true };
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