import { useState } from "react";
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

interface SalesChartProps {
  salesData: Array<{
    name: string;
    sales: number;
  }>;
}

const SalesChart = ({ salesData }: SalesChartProps) => {
  const [timePeriod, setTimePeriod] = useState("last7days");
  const { formatPrice } = useCurrency();

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
};

export default SalesChart;