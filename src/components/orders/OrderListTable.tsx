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
import { OrderStatusCell } from "@/components/orders/OrderStatusCell";
import { OrderStatusAction } from "@/components/orders/OrderStatusAction";
import { useCurrency } from "@/hooks/use-currency";

interface OrderListTableProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  onDelete: (orderId: string) => void;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  customer_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  district: string | null;
  state: string | null;
  postcode: string | null;
  order_items: {
    quantity: number;
    product: {
      name: string;
    } | null;
  }[];
}

export const OrderListTable = ({ orders, isLoading, onDelete }: OrderListTableProps) => {
  const { formatPrice } = useCurrency();

  const getProductNames = (orderItems: Order['order_items']) => {
    return orderItems
      .filter(item => item.product !== null)
      .map(item => item.product?.name)
      .filter(Boolean)
      .join(", ") || "N/A";
  };

  const getTotalQuantity = (orderItems: Order['order_items']) => {
    return orderItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
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
              <TableCell colSpan={11} className="text-center py-10">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              </TableCell>
            </TableRow>
          ) : orders?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-10">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.order_number || order.id}</TableCell>
                <TableCell>{order.customer_name || "N/A"}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{order.email || "N/A"}</div>
                    <div>{order.phone || "N/A"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{order.address || "N/A"}</div>
                    <div>{order.district}, {order.state} {order.postcode}</div>
                  </div>
                </TableCell>
                <TableCell>{getProductNames(order.order_items)}</TableCell>
                <TableCell>{getTotalQuantity(order.order_items)}</TableCell>
                <TableCell>{formatPrice(order.total_amount)}</TableCell>
                <TableCell>
                  <OrderStatusCell status={order.status} orderId={order.id} />
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
                    onClick={() => onDelete(order.id)}
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
  );
};