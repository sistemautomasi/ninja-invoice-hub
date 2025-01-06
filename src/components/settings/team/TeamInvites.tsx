import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { SendInviteForm } from "./SendInviteForm";
import { PendingInvitesList } from "./PendingInvitesList";

type UserRole = Database["public"]["Enums"]["user_role"];

export const TeamInvites = () => {
  const { toast } = useToast();
  const user = useUser();
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

  const acceptInvite = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: UserRole }) => {
      // First update the invite status
      const { error: inviteError } = await supabase
        .from('team_invites')
        .update({ status: 'accepted' })
        .eq('email', email)
        .eq('status', 'pending');

      if (inviteError) {
        console.error('Error accepting invite:', inviteError);
        throw inviteError;
      }

      // Then create or update the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user?.id,
          role: role,
        });

      if (roleError) {
        console.error('Error setting user role:', roleError);
        throw roleError;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invites'] });
      toast({
        title: "Success",
        description: "Team invite accepted successfully!",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to accept team invite. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendInvite = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: UserRole }) => {
      // First, create the invite in the database
      const { data: invite, error: dbError } = await supabase
        .from('team_invites')
        .insert([
          {
            email,
            role,
            invited_by: user?.id,
            status: 'pending'
          },
        ])
        .select();
      
      if (dbError) {
        console.error('Error creating invite:', dbError);
        throw dbError;
      }

      // Then, send the invite email
      const { data, error } = await supabase.functions.invoke('send-team-invite', {
        body: {
          to: email,
          role: role,
          invitedBy: user?.email,
        },
      });

      if (error) {
        console.error('Error sending invite:', error);
        throw error;
      }

      return invite;
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
        description: "Failed to send team invite. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SendInviteForm sendInvite={sendInvite} />
      <Separator />
      <div>
        <h3 className="text-lg font-semibold mb-4">Pending Invites</h3>
        <PendingInvitesList 
          pendingInvites={pendingInvites} 
          acceptInvite={acceptInvite}
        />
      </div>
    </div>
  );
};