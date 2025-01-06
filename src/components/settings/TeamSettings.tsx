import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMembersList } from "./team/TeamMembersList";
import { TeamInvites } from "./team/TeamInvites";
import { ActivityLogs } from "./team/ActivityLogs";
import { AdminCheck } from "./team/AdminCheck";

export const TeamSettings = () => {
  return (
    <AdminCheck>
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
    </AdminCheck>
  );
};