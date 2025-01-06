import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, TrendingUp } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

interface DashboardStatsProps {
  stats: {
    totalSales: number;
    ordersCount: number;
    percentageChange: string;
  } | undefined;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(stats?.totalSales || 0)}</div>
          <p className={`text-xs ${Number(stats?.percentageChange) >= 0 ? 'text-success' : 'text-destructive'}`}>
            {stats?.percentageChange}% from previous period
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Orders</CardTitle>
          <Package className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.ordersCount || 0}</div>
          <p className="text-xs text-muted-foreground">
            Today's total orders
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
          <TrendingUp className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(stats?.totalSales || 0)}</div>
          <p className="text-xs text-muted-foreground">
            Daily revenue
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;