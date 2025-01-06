import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrderStatusSummary } from "@/components/orders/OrderStatusSummary";
import { OrderListHeader } from "@/components/orders/OrderListHeader";
import { OrderListTable } from "@/components/orders/OrderListTable";
import { 
  startOfDay, endOfDay, startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, startOfYear, endOfYear, 
  subDays, subWeeks, subMonths, subYears 
} from "date-fns";

const OrderList = () => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState("all");
  const { toast } = useToast();

  const getTimeRange = (period: string) => {
    const now = new Date();
    switch (period) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "yesterday":
        const yesterday = subDays(now, 1);
        return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
      case "this_week":
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case "last_week":
        const lastWeek = subWeeks(now, 1);
        return { start: startOfWeek(lastWeek), end: endOfWeek(lastWeek) };
      case "this_month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "last_month":
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case "this_year":
        return { start: startOfYear(now), end: endOfYear(now) };
      case "last_year":
        const lastYear = subYears(now, 1);
        return { start: startOfYear(lastYear), end: endOfYear(lastYear) };
      default:
        return null;
    }
  };

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["orders", selectedStatus, timePeriod],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            product:products (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedStatus) {
        query = query.eq('status', selectedStatus);
      }

      const timeRange = getTimeRange(timePeriod);
      if (timeRange) {
        query = query
          .gte('created_at', timeRange.start.toISOString())
          .lte('created_at', timeRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data?.map(order => ({
        ...order,
        order_items: order.order_items.map(item => ({
          quantity: item.quantity,
          product: item.product
        }))
      }));
    },
  });

  const handleDelete = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders?.filter(order => {
    if (!search) return true;
    
    return order.order_items.some(item => 
      item.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.phone?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleStatusClick = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-left bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          Order List
        </h1>
        <OrderListHeader 
          search={search}
          onSearchChange={setSearch}
          timePeriod={timePeriod}
          onTimePeriodChange={setTimePeriod}
        />
      </div>

      <OrderStatusSummary 
        onStatusClick={handleStatusClick}
        selectedStatus={selectedStatus}
      />

      <OrderListTable 
        orders={filteredOrders}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OrderList;