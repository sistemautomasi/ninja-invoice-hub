import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";
import TimePeriodSelect from "@/components/dashboard/TimePeriodSelect";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths, subYears } from "date-fns";

export function SalesChart() {
  const [timePeriod, setTimePeriod] = useState("last7days");
  const { formatPrice } = useCurrency();

  const getTimeRange = (period: string) => {
    const now = new Date();
    switch (period) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "yesterday":
        const yesterday = subDays(now, 1);
        return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
      case "last7days":
        return { start: subDays(now, 7), end: now };
      case "last30days":
        return { start: subDays(now, 30), end: now };
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "lastMonth":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "allTime":
      default:
        return null;
    }
  };

  const { data: salesData } = useQuery({
    queryKey: ["salesData", timePeriod],
    queryFn: async () => {
      const timeRange = getTimeRange(timePeriod);
      let query = supabase
        .from("orders")
        .select("created_at, total_amount")
        .eq("status", "completed");

      if (timeRange) {
        query = query
          .gte("created_at", timeRange.start.toISOString())
          .lte("created_at", timeRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group sales by date
      const salesByDate = data.reduce((acc: Record<string, number>, order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + Number(order.total_amount);
        return acc;
      }, {});

      // Convert to array format for Recharts
      return Object.entries(salesByDate).map(([name, sales]) => ({
        name,
        sales,
      }));
    },
  });

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Sales Overview</h3>
          <TimePeriodSelect
            value={timePeriod}
            onValueChange={setTimePeriod}
          />
        </div>
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                vertical={false}
                opacity={0.5}
              />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#6b7280" 
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip 
                formatter={(value) => formatPrice(Number(value))}
                contentStyle={{ 
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  padding: '8px 12px'
                }}
                cursor={{ fill: 'rgba(30, 64, 175, 0.05)' }}
              />
              <Bar 
                dataKey="sales" 
                fill="#1E40AF"
                radius={[4, 4, 0, 0]}
                barSize={40}
                fillOpacity={0.8}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: '#4F46E5', r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}