import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrderStatusCellProps {
  status: string;
  orderId: string;
}

export const OrderStatusCell = ({ status: initialStatus, orderId }: OrderStatusCellProps) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);

  useEffect(() => {
    // Set up real-time subscription for status changes
    const channel = supabase
      .channel('orders-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload: any) => {
          if (payload.new && payload.new.status) {
            setCurrentStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [orderId]);

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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        getStatusColor(currentStatus)
      )}
    >
      {currentStatus}
    </span>
  );
};