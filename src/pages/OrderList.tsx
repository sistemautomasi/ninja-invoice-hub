import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrderStatusSummary } from "@/components/orders/OrderStatusSummary";
import { OrderListHeader } from "@/components/orders/OrderListHeader";
import { OrderListTable } from "@/components/orders/OrderListTable";

const OrderList = () => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["orders", selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            products (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedStatus) {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const transformedData = data?.map(order => ({
        ...order,
        order_items: order.order_items.map(item => ({
          quantity: item.quantity,
          product: item.products
        }))
      }));

      return transformedData;
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

  const filteredOrders = orders?.filter(order => 
    order.order_items.some(item => 
      item.product.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleStatusClick = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  return (
    <div className="space-y-6">
      <OrderListHeader 
        search={search}
        onSearchChange={setSearch}
      />

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