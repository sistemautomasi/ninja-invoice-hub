import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useOrderStatus } from "@/hooks/use-order-status";
import { getStatusColor } from "@/utils/orderStatusUtils";

interface OrderStatusCellProps {
  status: string;
  orderId: string;
}

export const OrderStatusCell = ({ status: initialStatus, orderId }: OrderStatusCellProps) => {
  const { currentStatus, isUpdating } = useOrderStatus(orderId, initialStatus);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize gap-1",
        getStatusColor(currentStatus)
      )}
    >
      {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
      {currentStatus}
    </span>
  );
};