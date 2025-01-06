import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SendInviteForm } from "./SendInviteForm";
import { PendingInvitesList } from "./PendingInvitesList";
import { DirectAddUser } from "./DirectAddUser";
import { useTeamInvites } from "@/hooks/use-team-invites";
import { useDirectAddUser } from "@/hooks/use-direct-add-user";

export const TeamInvites = () => {
  const { pendingInvites, isLoading, deleteInvite, sendInvite } = useTeamInvites();
  const { addUser } = useDirectAddUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DirectAddUser addUser={addUser} />
      <Separator />
      <SendInviteForm sendInvite={sendInvite} />
      <Separator />
      <div>
        <h3 className="text-lg font-semibold mb-4">Pending Invites</h3>
        <PendingInvitesList 
          pendingInvites={pendingInvites} 
          acceptInvite={addUser}
          deleteInvite={deleteInvite}
        />
      </div>
    </div>
  );
};