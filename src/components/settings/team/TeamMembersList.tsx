import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const TeamMembersList = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email');
      
      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      return profiles.map(profile => ({
        ...profile,
        role: roles.find(r => r.user_id === profile.id)?.role || 'staff'
      }));
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Current Team Members</h3>
      <div className="space-y-4">
        {teamMembers?.map((member: any) => (
          <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{member.full_name}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
            <div className="text-sm">
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};