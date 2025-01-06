import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Loader2 } from "lucide-react";
import { CustomTooltip } from "./components/CustomTooltip";
import { 
  getDateRange, 
  processAdCostsData, 
  chartColors, 
  formatPlatformName 
} from "./utils/chartUtils";

interface AdCostsChartProps {
  selectedPeriod: string;
}

export const AdCostsChart = ({ selectedPeriod }: AdCostsChartProps) => {
  const { data: adCosts, isLoading } = useQuery({
    queryKey: ["adCosts", selectedPeriod],
    queryFn: async () => {
      const { start, end } = getDateRange(selectedPeriod);
      
      const { data, error } = await supabase
        .from('business_costs')
        .select('*')
        .eq('cost_type', 'advertising')
        .gte('date', start.toISOString())
        .lte('date', end.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      return processAdCostsData(data);
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
                  stroke={chartColors[platform as keyof typeof chartColors] || "#666666"}
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
                stroke={chartColors.total}
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