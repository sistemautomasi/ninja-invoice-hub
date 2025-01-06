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
    facebook: "#1877F2", // Updated Facebook blue
    tiktok: "#000000",
    google: "#EA4335", // Updated Google red
    instagram: "#E4405F", // Updated Instagram pink
    Other: "#94A3B8", // Softer gray
    total: "#3B82F6" // Bright blue for total
  };

  const formatPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      facebook: "Facebook",
      tiktok: "TikTok",
      google: "Google",
      instagram: "Instagram",
      Other: "Other",
      total: "Total"
    };
    return names[platform] || platform;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700">{formatPlatformName(entry.name)}:</span>
              <span className="font-medium">${entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Advertising Costs Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={adCosts}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748B"
                tick={{ fill: '#64748B' }}
                tickLine={{ stroke: '#64748B' }}
              />
              <YAxis 
                stroke="#64748B"
                tick={{ fill: '#64748B' }}
                tickLine={{ stroke: '#64748B' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={formatPlatformName}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px"
                }}
              />
              {platforms.map((platform) => (
                <Line
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  name={platform}
                  stroke={colors[platform as keyof typeof colors] || "#666666"}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              ))}
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke={colors.total}
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};