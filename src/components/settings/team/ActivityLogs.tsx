import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const ActivityLogs = () => {
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          profiles:profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
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
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-4">
        {activityLogs?.map((log: any) => (
          <div key={log.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {log.profiles?.full_name || 'Unknown User'}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
            <p className="text-sm mt-1">{log.action}</p>
            {log.details && (
              <pre className="text-xs mt-2 p-2 bg-muted rounded">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};