import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

export const useTeamInvites = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingInvites, isLoading } = useQuery({
    queryKey: ['team-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_invites')
        .select('*')
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error fetching invites:', error);
        throw error;
      }
      return data;
    },
  });

  const deleteInvite = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from('team_invites')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invites'] });
      toast({
        title: "Success",
        description: "Team invite deleted successfully!",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to delete team invite. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendInvite = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: UserRole }) => {
      const { data: existingInvites, error: checkError } = await supabase
        .from('team_invites')
        .select('*')
        .eq('email', email)
        .eq('status', 'pending');
      
      if (checkError) throw checkError;
      if (existingInvites?.length) {
        throw new Error('There is already a pending invite for this email');
      }

      const { error: dbError } = await supabase
        .from('team_invites')
        .insert([{ email, role, status: 'pending' }]);
      
      if (dbError) throw dbError;

      const { error } = await supabase.functions.invoke('send-team-invite', {
        body: { to: email, role },
      });

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invites'] });
      toast({
        title: "Success",
        description: "Team invite sent successfully!",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send team invite.",
        variant: "destructive",
      });
    },
  });

  return {
    pendingInvites,
    isLoading,
    deleteInvite,
    sendInvite,
  };
};