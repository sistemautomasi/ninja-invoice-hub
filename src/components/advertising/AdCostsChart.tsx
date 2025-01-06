import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { startOfDay, subDays, format } from "date-fns";
import { Loader2 } from "lucide-react";

interface AdCostsChartProps {
  selectedPeriod: string;
}

export const AdCostsChart = ({ selectedPeriod }: AdCostsChartProps) => {
  const getDateRange = () => {
    const now = new Date();
    const today = startOfDay(now);
    
    switch (selectedPeriod) {
      case "today":
        return { start: today, end: now };
      case "last7days":
        return { start: subDays(now, 7), end: now };
      case "last30days":
        return { start: subDays(now, 30), end: now };
      default:
        return { start: today, end: now };
    }
  };

  const { data: adCosts, isLoading } = useQuery({
    queryKey: ["adCosts", selectedPeriod],
    queryFn: async () => {
      const { start, end } = getDateRange();
      
      const { data, error } = await supabase
        .from('business_costs')
        .select('*')
        .eq('cost_type', 'advertising')
        .gte('date', start.toISOString())
        .lte('date', end.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      // Group costs by date and platform
      const groupedData = data.reduce((acc: any[], cost) => {
        const date = format(new Date(cost.date), 'MMM dd');
        const existingDate = acc.find(item => item.date === date);

        if (existingDate) {
          existingDate[cost.platform || 'Other'] = (existingDate[cost.platform || 'Other'] || 0) + Number(cost.amount);
          existingDate.total = (existingDate.total || 0) + Number(cost.amount);
        } else {
          const newEntry = {
            date,
            [cost.platform || 'Other']: Number(cost.amount),
            total: Number(cost.amount)
          };
          acc.push(newEntry);
        }

        return acc;
      }, []);

      return groupedData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const platforms = Array.from(
    new Set(
      adCosts?.flatMap(cost => 
        Object.keys(cost).filter(key => 
          key !== 'date' && key !== 'total'
        )
      ) || []
    )
  );

  const colors = {
    facebook: "#4267B2",
    tiktok: "#000000",
    google: "#DB4437",
    instagram: "#E1306C",
    Other: "#666666",
    total: "#2563EB"
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Advertising Costs Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={adCosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {platforms.map((platform) => (
                <Line
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  stroke={colors[platform as keyof typeof colors] || "#666666"}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
              <Line
                type="monotone"
                dataKey="total"
                stroke={colors.total}
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};