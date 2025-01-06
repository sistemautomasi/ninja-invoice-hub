import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMembersList } from "./team/TeamMembersList";
import { TeamInvites } from "./team/TeamInvites";
import { ActivityLogs } from "./team/ActivityLogs";
import { useDirectAddUser } from "@/hooks/use-direct-add-user";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export const TeamSettings = () => {
  const { isAdmin } = useDirectAddUser();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        console.log("No user found");
        setLoading(false);
        return;
      }

      try {
        console.log("Checking admin status for:", user.email);
        
        // First try to get the user's profile ID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setLoading(false);
          return;
        }

        console.log("Profile data:", profileData);

        // Then check user_roles using the profile ID
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profileData.id)
          .single();

        if (roleError) {
          console.error('Error checking admin status:', roleError);
          setLoading(false);
          return;
        }

        console.log("User role data:", userRole);
        setAdminStatus(userRole?.role === 'admin');
      } catch (error) {
        console.error('Error in admin check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

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

  if (!adminStatus) {
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