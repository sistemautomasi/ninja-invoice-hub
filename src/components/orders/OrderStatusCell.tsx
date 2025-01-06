import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface OrderStatusCellProps {
  status: string;
  orderId: string;
}

export const OrderStatusCell = ({ status: initialStatus, orderId }: OrderStatusCellProps) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  // Force status update when prop changes
  useEffect(() => {
    console.log(`Status cell received new status: ${initialStatus}`);
    setCurrentStatus(initialStatus);
    setIsUpdating(false);
  }, [initialStatus]);

  // Set up real-time subscription
  useEffect(() => {
    console.log(`Setting up real-time subscription for order: ${orderId}`);
    
    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload: any) => {
          console.log(`Received real-time update for order ${orderId}:`, payload);
          if (payload.new && payload.new.status !== currentStatus) {
            setIsUpdating(true);
            setCurrentStatus(payload.new.status);
            setIsUpdating(false);
          }
        }
      )
      .subscribe();

    return () => {
      console.log(`Cleaning up subscription for order: ${orderId}`);
      void supabase.removeChannel(channel);
    };
  }, [orderId, currentStatus]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      shipped: "bg-orange-100 text-orange-800",
      cancelled: "bg-red-100 text-red-800",
      returned: "bg-yellow-100 text-yellow-800",
    } as const;

    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

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