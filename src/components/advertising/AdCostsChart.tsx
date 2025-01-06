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

  // Updated colors with higher contrast and vibrancy
  const colors = {
    facebook: "#1877F2",
    tiktok: "#FF0050",
    google: "#EA4335",
    instagram: "#E4405F",
    Other: "#64748B",
    total: "#8B5CF6" // Vibrant purple for total
  };

  const formatPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      facebook: "Facebook Ads",
      tiktok: "TikTok Ads",
      google: "Google Ads",
      instagram: "Instagram Ads",
      Other: "Other Platforms",
      total: "Total Spend"
    };
    return names[platform] || platform;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-3 border-b pb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 py-1">
              <div 
                className="w-4 h-4 rounded-full shadow-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 font-medium">{formatPlatformName(entry.name)}:</span>
              <span className="font-semibold text-gray-900">
                ${Number(entry.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
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
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E2E8F0" 
                strokeOpacity={0.8}
              />
              <XAxis 
                dataKey="date" 
                stroke="#64748B"
                tick={{ fill: '#64748B', fontSize: 12 }}
                tickLine={{ stroke: '#64748B' }}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <YAxis 
                stroke="#64748B"
                tick={{ fill: '#64748B', fontSize: 12 }}
                tickLine={{ stroke: '#64748B' }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: '#94A3B8', strokeWidth: 1 }}
              />
              <Legend 
                formatter={formatPlatformName}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px",
                  paddingBottom: "10px"
                }}
                iconSize={10}
              />
              {platforms.map((platform) => (
                <Line
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  name={platform}
                  stroke={colors[platform as keyof typeof colors] || "#666666"}
                  strokeWidth={2.5}
                  dot={{ 
                    r: 4, 
                    strokeWidth: 2,
                    fill: "#FFFFFF"
                  }}
                  activeDot={{ 
                    r: 6, 
                    strokeWidth: 2,
                    fill: "#FFFFFF"
                  }}
                />
              ))}
              <Line
                type="monotone"
                dataKey="total"
                name="total"
                stroke={colors.total}
                strokeWidth={3}
                dot={{ 
                  r: 5, 
                  strokeWidth: 2,
                  fill: "#FFFFFF"
                }}
                activeDot={{ 
                  r: 7, 
                  strokeWidth: 2,
                  fill: "#FFFFFF"
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};