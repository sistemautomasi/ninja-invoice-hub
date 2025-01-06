import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Users, Package, TrendingUp, ShoppingCart, Percent, Award } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

interface DashboardStatsProps {
  stats: {
    totalSales: number;
    ordersCount: number;
    percentageChange: string;
    averageOrderValue?: number;
    profitMargin?: number;
    customerLifetimeValue?: number;
    averageProcessingTime?: string;
    topSellingProduct?: {
      name: string;
      totalSold: number;
    };
  } | undefined;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(stats?.totalSales || 0)}
          </div>
          <p className={`text-xs mt-1 ${Number(stats?.percentageChange) >= 0 ? 'text-success' : 'text-destructive'}`}>
            {stats?.percentageChange}% from previous period
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          <Percent className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.profitMargin?.toFixed(1) || '0'}%
          </div>
          <p className="text-xs mt-1 text-muted-foreground">
            Net profit after costs
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(stats?.customerLifetimeValue || 0)}
          </div>
          <p className="text-xs mt-1 text-muted-foreground">
            Average lifetime value
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.averageProcessingTime || '0h'}
          </div>
          <p className="text-xs mt-1 text-muted-foreground">
            Average order processing
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Top Product</CardTitle>
          <Award className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">
            {stats?.topSellingProduct?.name || 'No data'}
          </div>
          <p className="text-xs mt-1 text-muted-foreground">
            {stats?.topSellingProduct?.totalSold || 0} units sold
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Orders Overview</CardTitle>
          <Package className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.ordersCount || 0}
          </div>
          <p className="text-xs mt-1 text-muted-foreground">
            Total orders this period
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;