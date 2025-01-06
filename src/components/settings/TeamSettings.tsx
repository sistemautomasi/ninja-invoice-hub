import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMembersList } from "./team/TeamMembersList";
import { TeamInvites } from "./team/TeamInvites";
import { ActivityLogs } from "./team/ActivityLogs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const TeamSettings = () => {
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        console.log("No user found in auth state");
        setLoading(false);
        return;
      }

      try {
        console.log("Checking admin status for user ID:", user.id);
        
        // First check if user exists in user_roles directly with user.id
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!roleError && roleData?.role === 'admin') {
          console.log("Found admin role directly:", roleData);
          setAdminStatus(true);
          setLoading(false);
          return;
        }

        if (roleError) {
          console.log("Direct role check failed, trying through email:", roleError);
        }

        // If no direct match and user has email, check through profiles
        if (user.email) {
          console.log("Checking admin status through email:", user.email);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', user.email)
            .maybeSingle();

          if (profileError) {
            console.error('Profile check error:', profileError);
            toast({
              title: "Error",
              description: "Failed to verify user profile",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }

          if (profileData?.id) {
            console.log("Found profile:", profileData);
            const { data: adminData, error: adminError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', profileData.id)
              .maybeSingle();

            if (adminError) {
              console.error('Admin check error:', adminError);
              toast({
                title: "Error",
                description: "Failed to verify admin status",
                variant: "destructive",
              });
            } else {
              console.log("Admin check result:", adminData);
              setAdminStatus(adminData?.role === 'admin');
            }
          } else {
            console.log("No profile found for email:", user.email);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while checking permissions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkAdminStatus();
    } else {
      setLoading(false);
    }
  }, [user, toast]);

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
              You need admin access to view team management settings.
              <div className="mt-2 text-sm text-muted-foreground">
                User ID: {user.id}
                <br />
                Email: {user.email}
              </div>
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