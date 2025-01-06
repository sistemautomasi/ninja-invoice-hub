import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, startOfMonth, endOfMonth, format, subMonths, differenceInDays } from "date-fns";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ShippingOverview from "@/components/dashboard/ShippingOverview";
import TimePeriodSelect from "@/components/dashboard/TimePeriodSelect";
import SalesChartContainer from "@/components/dashboard/charts/SalesChartContainer";

// Define the interval type for processing_time
interface ProcessingTimeInterval {
  hours: number;
  minutes: number;
  seconds: number;
}

interface OrderWithItems {
  id: string;
  total_amount: number;
  status: string;
  processing_time: ProcessingTimeInterval | null;
  order_items: {
    quantity: number;
    price_at_time: number;
    product: {
      id: string;
      name: string;
    } | null;
  }[] | null;
}

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState("today");

  const getDateRange = () => {
    const now = new Date();
    const today = startOfDay(now);
    
    switch (timePeriod) {
      case "allTime":
        return { start: new Date(2020, 0, 1), end: now };
      case "today":
        return { start: today, end: now };
      case "yesterday": {
        const yesterday = startOfDay(subDays(today, 1));
        return { start: yesterday, end: today };
      }
      case "last7days":
        return { start: subDays(now, 7), end: now };
      case "last30days":
        return { start: subDays(now, 30), end: now };
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "lastMonth": {
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      }
      default:
        return { start: today, end: now };
    }
  };

  const { data: stats } = useQuery({
    queryKey: ["orderStats", timePeriod],
    queryFn: async () => {
      const { start, end } = getDateRange();
      
      // Calculate previous period
      const periodDays = differenceInDays(end, start) || 1;
      const previousStart = subDays(start, periodDays);
      const previousEnd = start;
      
      // Fetch orders with items for the current period
      const { data: currentOrders, error: currentError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          processing_time,
          order_items (
            quantity,
            price_at_time,
            product:products (
              id,
              name
            )
          )
        `)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .returns<OrderWithItems[]>();

      if (currentError) throw currentError;

      // Fetch previous period orders
      const { data: previousOrders, error: previousError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', previousEnd.toISOString());

      if (previousError) throw previousError;

      // Fetch customer metrics for CLV
      const { data: customerMetrics, error: metricsError } = await supabase
        .from('customer_metrics')
        .select('lifetime_value')
        .not('lifetime_value', 'is', null);

      if (metricsError) throw metricsError;

      // Calculate totals and metrics
      const currentTotal = currentOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const previousTotal = previousOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      
      // Calculate profit margin (assuming 30% cost of goods)
      const costOfGoods = currentTotal * 0.7;
      const profitMargin = ((currentTotal - costOfGoods) / currentTotal) * 100;

      // Calculate average customer lifetime value
      const averageClv = customerMetrics?.length 
        ? customerMetrics.reduce((sum, metric) => sum + Number(metric.lifetime_value), 0) / customerMetrics.length 
        : 0;

      // Calculate average processing time
      const ordersWithProcessingTime = currentOrders?.filter(order => order.processing_time) || [];
      const averageProcessingTime = ordersWithProcessingTime.length
        ? ordersWithProcessingTime.reduce((sum, order) => {
            const hours = order.processing_time?.hours || 0;
            const minutes = order.processing_time?.minutes || 0;
            return sum + (hours + minutes / 60);
          }, 0) / ordersWithProcessingTime.length
        : 0;

      // Calculate top selling product
      const productSales: Record<string, { name: string; totalSold: number }> = {};
      currentOrders?.forEach(order => {
        order.order_items?.forEach(item => {
          if (item.product) {
            const { id, name } = item.product;
            if (!productSales[id]) {
              productSales[id] = { name, totalSold: 0 };
            }
            productSales[id].totalSold += item.quantity;
          }
        });
      });

      const topProduct = Object.values(productSales)
        .sort((a, b) => b.totalSold - a.totalSold)[0] || null;

      // Calculate shipping stats
      const confirmed = currentOrders?.filter(order => order.status === 'pending').length || 0;
      const toShip = currentOrders?.filter(order => order.status === 'confirmed').length || 0;
      const inTransit = currentOrders?.filter(order => order.status === 'shipped').length || 0;
      const delivered = currentOrders?.filter(order => order.status === 'completed').length || 0;

      const percentageChange = previousTotal === 0 
        ? 100 
        : ((currentTotal - previousTotal) / previousTotal) * 100;

      return {
        totalSales: currentTotal,
        ordersCount: currentOrders?.length || 0,
        percentageChange: percentageChange.toFixed(1),
        profitMargin,
        customerLifetimeValue: averageClv,
        averageProcessingTime: `${Math.floor(averageProcessingTime)}h ${Math.round((averageProcessingTime % 1) * 60)}m`,
        topSellingProduct: topProduct,
        shipping: { confirmed, toShip, inTransit, delivered }
      };
    },
  });

  const { data: salesData } = useQuery({
    queryKey: ["salesChart", timePeriod],
    queryFn: async () => {
      const { start, end } = getDateRange();
      
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!data) return [];

      const groupedData: Record<string, { name: string; sales: number }> = {};
      
      data.forEach(order => {
        const date = format(new Date(order.created_at), 'MMM dd');
        if (!groupedData[date]) {
          groupedData[date] = { name: date, sales: 0 };
        }
        groupedData[date].sales += Number(order.total_amount);
      });

      return Object.values(groupedData);
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <TimePeriodSelect value={timePeriod} onValueChange={setTimePeriod} />
      </div>
      
      <DashboardStats stats={stats} />
      <ShippingOverview shipping={stats?.shipping} />
      <SalesChartContainer salesData={salesData || []} />
    </div>
  );
};

export default Dashboard;