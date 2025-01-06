import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, TrendingUp, Truck, CheckCircle, Box } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";

const Dashboard = () => {
  const { formatPrice } = useCurrency();

  // Fetch order statistics
  const { data: stats } = useQuery({
    queryKey: ["orderStats"],
    queryFn: async () => {
      const today = new Date();
      const yesterday = subDays(today, 1);
      
      // Get today's orders
      const { data: todayOrders, error: todayError } = await supabase
        .from('orders')
        .select('total_amount, status')
        .gte('created_at', startOfDay(today).toISOString());

      if (todayError) throw todayError;

      // Get yesterday's orders for comparison
      const { data: yesterdayOrders, error: yesterdayError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', startOfDay(yesterday).toISOString())
        .lt('created_at', startOfDay(today).toISOString());

      if (yesterdayError) throw yesterdayError;

      // Calculate totals
      const todayTotal = todayOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const yesterdayTotal = yesterdayOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      
      // Calculate shipping stats
      const toShip = todayOrders?.filter(order => order.status === 'pending').length || 0;
      const inTransit = todayOrders?.filter(order => order.status === 'shipped').length || 0;
      const delivered = todayOrders?.filter(order => order.status === 'completed').length || 0;

      const percentageChange = yesterdayTotal === 0 
        ? 100 
        : ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;

      return {
        totalSales: todayTotal,
        ordersCount: todayOrders?.length || 0,
        percentageChange: percentageChange.toFixed(1),
        shipping: { toShip, inTransit, delivered }
      };
    },
  });

  // Fetch sales data for chart
  const { data: salesData } = useQuery({
    queryKey: ["salesChart"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .order('created_at', { ascending: true })
        .limit(30);

      if (error) throw error;

      const groupedData = data.reduce((acc: any, order) => {
        const date = format(new Date(order.created_at), 'MMM dd');
        if (!acc[date]) {
          acc[date] = { name: date, sales: 0 };
        }
        acc[date].sales += Number(order.total_amount);
        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">Welcome back to your dashboard</p>
      </div>
      
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

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Shipping Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Box className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">To Ship</p>
                <p className="text-2xl font-bold">{stats?.shipping.toShip || 0}</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg flex items-center space-x-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Truck className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">{stats?.shipping.inTransit || 0}</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{stats?.shipping.delivered || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => formatPrice(Number(value))}
                  contentStyle={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#1E40AF"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;