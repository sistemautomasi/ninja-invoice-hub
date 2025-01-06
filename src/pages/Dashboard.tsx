import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, startOfMonth, endOfMonth, format, subMonths, differenceInDays } from "date-fns";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ShippingOverview from "@/components/dashboard/ShippingOverview";
import SalesChart from "@/components/dashboard/SalesChart";
import TimePeriodSelect from "@/components/dashboard/TimePeriodSelect";

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState("today");

  const getDateRange = () => {
    const now = new Date();
    const today = startOfDay(now);
    
    switch (timePeriod) {
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
      
      // Calculate previous period with proper day difference
      const periodDays = differenceInDays(end, start) || 1; // Ensure at least 1 day
      const previousStart = subDays(start, periodDays);
      const previousEnd = start;
      
      // Get current period orders
      const { data: currentOrders, error: currentError } = await supabase
        .from('orders')
        .select('total_amount, status')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (currentError) throw currentError;

      // Get previous period orders
      const { data: previousOrders, error: previousError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', previousEnd.toISOString());

      if (previousError) throw previousError;

      // Calculate totals
      const currentTotal = currentOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const previousTotal = previousOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      
      // Calculate shipping stats
      const toShip = currentOrders?.filter(order => order.status === 'pending').length || 0;
      const inTransit = currentOrders?.filter(order => order.status === 'shipped').length || 0;
      const delivered = currentOrders?.filter(order => order.status === 'completed').length || 0;

      const percentageChange = previousTotal === 0 
        ? 100 
        : ((currentTotal - previousTotal) / previousTotal) * 100;

      return {
        totalSales: currentTotal,
        ordersCount: currentOrders?.length || 0,
        percentageChange: percentageChange.toFixed(1),
        shipping: { toShip, inTransit, delivered }
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
      <SalesChart salesData={salesData || []} />
    </div>
  );
};

export default Dashboard;