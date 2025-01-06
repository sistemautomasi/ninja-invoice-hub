import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const sendInvite = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'admin' | 'staff' }) => {
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

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const role = formData.get('role') as 'admin' | 'staff';

    if (!email || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    sendInvite.mutate({ email, role });
    (e.target as HTMLFormElement).reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Send Team Invite</h3>
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="flex-1"
            />
            <Select name="role" defaultValue="staff">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={sendInvite.isPending}>
            {sendInvite.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Send Invite
          </Button>
        </form>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Pending Invites</h3>
        <div className="space-y-4">
          {pendingInvites?.length === 0 && (
            <p className="text-muted-foreground">No pending invites</p>
          )}
          {pendingInvites?.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{invite.email}</p>
                <p className="text-sm text-muted-foreground">
                  Role: {invite.role} • Expires: {new Date(invite.expires_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};