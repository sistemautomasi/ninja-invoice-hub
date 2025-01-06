import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useOrderStatus = (orderId: string, initialStatus: string) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

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
          if (payload.new && payload.new.status && payload.new.status !== currentStatus) {
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
  }, [orderId]);

  // Update status when prop changes
  useEffect(() => {
    console.log(`Status received new initial status: ${initialStatus}`);
    if (initialStatus !== currentStatus) {
      setIsUpdating(true);
      setCurrentStatus(initialStatus);
      setIsUpdating(false);
    }
  }, [initialStatus, currentStatus]);

  return { currentStatus, isUpdating, setCurrentStatus, setIsUpdating };
};