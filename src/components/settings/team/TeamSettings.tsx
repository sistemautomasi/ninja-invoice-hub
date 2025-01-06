import { TeamMembersList } from "./TeamMembersList";
import { InviteTeamMember } from "./InviteTeamMember";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const TeamSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>
            Manage your team members and send invitations to new members.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <InviteTeamMember />
          <Separator className="my-6" />
          <TeamMembersList />
        </CardContent>
      </Card>
    </div>
  );
};