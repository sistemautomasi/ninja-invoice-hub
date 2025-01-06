import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const TeamMembersList = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email');
      
      if (error) throw error;
      return data;
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
          </div>
        ))}
      </div>
    </div>
  );
};