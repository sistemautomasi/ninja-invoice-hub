import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, TrendingUp, Users, ShoppingCart } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

interface DashboardStatsProps {
  stats: {
    totalSales: number;
    ordersCount: number;
    percentageChange: string;
    averageOrderValue?: number;
    uniqueCustomers?: number;
  } | undefined;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">{formatPrice(stats?.totalSales || 0)}</div>
          <p className={`text-xs mt-1 ${Number(stats?.percentageChange) >= 0 ? 'text-success' : 'text-destructive'}`}>
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
          <p className="text-xs mt-1 text-muted-foreground whitespace-nowrap">
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
          <div className="text-2xl font-bold truncate">{formatPrice(stats?.totalSales || 0)}</div>
          <p className="text-xs mt-1 text-muted-foreground whitespace-nowrap">
            Daily revenue
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
          <ShoppingCart className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {formatPrice(stats?.averageOrderValue || 0)}
          </div>
          <p className="text-xs mt-1 text-muted-foreground whitespace-nowrap">
            Per order average
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
          <Users className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.uniqueCustomers || 0}</div>
          <p className="text-xs mt-1 text-muted-foreground whitespace-nowrap">
            Active customers
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;