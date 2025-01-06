import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useOrderStatus } from "@/hooks/use-order-status";
import { useUpdateOrderStatus } from "@/hooks/use-update-order-status";
import { statusOptions } from "@/utils/orderStatusUtils";

interface OrderStatusActionProps {
  orderId: string;
  currentStatus: string;
}

export const OrderStatusAction = ({ orderId, currentStatus: initialStatus }: OrderStatusActionProps) => {
  const { currentStatus } = useOrderStatus(orderId, initialStatus);
  const { updateStatus, isLoading } = useUpdateOrderStatus(orderId, currentStatus);

  return (
    <div className="relative">
      <Select
        value={currentStatus}
        onValueChange={updateStatus}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[140px]">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            <SelectValue placeholder="Select status" />
          )}
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};