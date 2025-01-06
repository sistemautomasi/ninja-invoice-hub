import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { useCurrency } from "@/hooks/use-currency";

interface SalesChartProps {
  salesData: Array<{ name: string; sales: number; }> | undefined;
}

const SalesChart = ({ salesData }: SalesChartProps) => {
  const { formatPrice } = useCurrency();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Sales Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly sales performance
        </p>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default SalesChart;