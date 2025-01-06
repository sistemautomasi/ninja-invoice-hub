import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, startOfMonth, endOfMonth, format, subMonths, differenceInDays } from "date-fns";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ShippingOverview from "@/components/dashboard/ShippingOverview";
import TimePeriodSelect from "@/components/dashboard/TimePeriodSelect";
import SalesChartContainer from "@/components/dashboard/charts/SalesChartContainer";
import { calculateTotalCostsByType, calculateNetProfit, calculateProfitMargin } from "@/utils/profitCalculations";

interface OrderWithItems {
  id: string;
  total_amount: number;
  status: string;
  order_items: {
    quantity: number;
    price_at_time: number;
    product: {
      id: string;
      name: string;
      cost: number;
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
      
      // Fetch orders with items
      const { data: currentOrders, error: currentError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          order_items (
            quantity,
            price_at_time,
            product:products (
              id,
              name,
              cost
            )
          )
        `)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .returns<OrderWithItems[]>();

      if (currentError) throw currentError;

      // Fetch business costs for the period
      const { data: businessCosts, error: costsError } = await supabase
        .from('business_costs')
        .select('*')
        .gte('date', start.toISOString())
        .lte('date', end.toISOString());

      if (costsError) throw costsError;

      // Fetch previous period orders
      const { data: previousOrders, error: previousError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', previousEnd.toISOString());

      if (previousError) throw previousError;

      // Calculate total revenue and product costs
      let totalRevenue = 0;
      let totalProductCosts = 0;

      currentOrders?.forEach(order => {
        totalRevenue += Number(order.total_amount);
        
        order.order_items?.forEach(item => {
          if (item.product) {
            const itemCost = Number(item.product.cost) * item.quantity;
            totalProductCosts += itemCost;
          }
        });
      });

      // Calculate advertising and shipping costs
      const advertisingCosts = calculateTotalCostsByType(businessCosts, 'advertising', start, end);
      const shippingCosts = calculateTotalCostsByType(businessCosts, 'shipping', start, end);

      // Calculate net profit and margin
      const netProfit = calculateNetProfit(
        totalRevenue,
        totalProductCosts,
        advertisingCosts,
        shippingCosts
      );
      
      const profitMargin = calculateProfitMargin(netProfit, totalRevenue);

      // Calculate percentage change
      const previousRevenue = previousOrders?.reduce((sum, order) => 
        sum + Number(order.total_amount), 0) || 0;

      const percentageChange = previousRevenue === 0 
        ? 100 
        : ((totalRevenue - previousRevenue) / previousRevenue) * 100;

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

      return {
        totalSales: totalRevenue,
        ordersCount: currentOrders?.length || 0,
        percentageChange: percentageChange.toFixed(1),
        profitMargin: Number(profitMargin.toFixed(1)),
        profit: netProfit,
        advertisingCosts,
        topSellingProduct: topProduct,
        shipping: { confirmed, toShip, inTransit, delivered }
      };
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
      <SalesChartContainer data={salesData || []} />
    </div>
  );
};

export default Dashboard;