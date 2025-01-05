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
  order_items: {
    quantity: number;
    product: {
      name: string;
    };
  }[];
}

export const OrderListTable = ({ orders, isLoading, onDelete }: OrderListTableProps) => {
  const { formatPrice } = useCurrency();

  return (
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
          ) : orders?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders?.map((order) => (
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