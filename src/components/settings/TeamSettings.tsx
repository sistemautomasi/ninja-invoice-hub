import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMembersList } from "./team/TeamMembersList";
import { TeamInvites } from "./team/TeamInvites";
import { ActivityLogs } from "./team/ActivityLogs";
import { useDirectAddUser } from "@/hooks/use-direct-add-user";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";

export const TeamSettings = () => {
  const { isAdmin } = useDirectAddUser();
  const user = useUser();

  useEffect(() => {
    console.log("Current user:", user);
    console.log("Is admin:", isAdmin);
  }, [user, isAdmin]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to access team management settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need admin access to view team management settings. Current user: {user.email}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="invites" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invites
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <TeamMembersList />
          </TabsContent>

          <TabsContent value="invites">
            <TeamInvites />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLogs />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};