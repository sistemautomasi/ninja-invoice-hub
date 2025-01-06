import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUser } from "@supabase/auth-helpers-react";
import { UseMutationResult } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];
type TeamInvite = {
  id: string;
  email: string;
  role: UserRole;
  status: string;
  expires_at: string;
};

interface PendingInvitesListProps {
  pendingInvites: TeamInvite[] | null;
  acceptInvite: UseMutationResult<any, Error, { email: string; role: UserRole }, unknown>;
}

export const PendingInvitesList = ({ pendingInvites, acceptInvite }: PendingInvitesListProps) => {
  const user = useUser();

  if (!pendingInvites?.length) {
    return <p className="text-muted-foreground">No pending invites</p>;
  }

  return (
    <div className="space-y-4">
      {pendingInvites.map((invite) => (
        <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{invite.email}</p>
            <p className="text-sm text-muted-foreground">
              Role: {invite.role} • Expires: {new Date(invite.expires_at).toLocaleDateString()}
            </p>
          </div>
          {user?.email === invite.email && invite.status === 'pending' && (
            <Button 
              onClick={() => acceptInvite.mutate({ 
                email: invite.email, 
                role: invite.role 
              })}
              disabled={acceptInvite.isPending}
            >
              {acceptInvite.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Accept Invite
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};