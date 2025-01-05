import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/hooks/use-currency";
import { OrderStatusSummary } from "@/components/orders/OrderStatusSummary";
import { OrderStatusCell } from "@/components/orders/OrderStatusCell";
import { OrderStatusAction } from "@/components/orders/OrderStatusAction";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: {
    quantity: number;
    product: {
      name: string;
    };
  }[];
}

const OrderList = () => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { formatPrice } = useCurrency();
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

      return transformedData as Order[];
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order List</h1>
        <Input
          placeholder="Search orders..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <OrderStatusSummary 
        onStatusClick={handleStatusClick}
        selectedStatus={selectedStatus}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number || order.id}</TableCell>
                  <TableCell>
                    {order.order_items.map(item => item.product.name).join(", ")}
                  </TableCell>
                  <TableCell>
                    {order.order_items.reduce((sum, item) => sum + item.quantity, 0)}
                  </TableCell>
                  <TableCell>{formatPrice(order.total_amount)}</TableCell>
                  <TableCell>
                    <OrderStatusCell status={order.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <OrderStatusAction 
                      orderId={order.id} 
                      currentStatus={order.status}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderList;