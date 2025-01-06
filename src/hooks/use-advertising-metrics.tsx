import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays } from "date-fns";

export const useAdvertisingMetrics = (selectedPeriod: string) => {
  const getDateRange = () => {
    const now = new Date();
    const today = startOfDay(now);
    
    switch (selectedPeriod) {
      case "today":
        return { start: today, end: now };
      case "last7days":
        return { start: subDays(now, 7), end: now };
      case "last30days":
        return { start: subDays(now, 30), end: now };
      default:
        return { start: today, end: now };
    }
  };

  return useQuery({
    queryKey: ["advertisingMetrics", selectedPeriod],
    queryFn: async () => {
      const { start, end } = getDateRange();
      
      // Fetch total sales for the period
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (ordersError) throw ordersError;

      // Fetch advertising costs for the period
      const { data: adCosts, error: costsError } = await supabase
        .from('business_costs')
        .select('amount')
        .eq('cost_type', 'advertising')
        .gte('date', start.toISOString())
        .lte('date', end.toISOString());

      if (costsError) throw costsError;

      // Calculate totals
      const totalSales = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const totalAdCosts = adCosts?.reduce((sum, cost) => sum + Number(cost.amount), 0) || 0;
      const netRevenue = totalSales - totalAdCosts;
      const roas = totalAdCosts > 0 ? (netRevenue / totalAdCosts) * 100 : 0;

      return {
        totalSales,
        totalAdCosts,
        netRevenue,
        roas
      };
    },
  });
};