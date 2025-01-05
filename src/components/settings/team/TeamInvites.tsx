import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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
      
      if (error) throw error;
      return data;
    },
  });

  const sendInvite = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'admin' | 'staff' }) => {
      const { error } = await supabase
        .from('team_invites')
        .insert([
          {
            email,
            role,
            invited_by: user?.id,
          },
        ]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invites'] });
      toast({
        title: "Success",
        description: "Team invite sent successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send team invite.",
        variant: "destructive",
      });
    },
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    sendInvite.mutate({
      email: String(formData.get('email')),
      role: String(formData.get('role')) as 'admin' | 'staff',
    });
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
            />
            <select
              name="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
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