import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateOrderStatus = (orderId: string, currentStatus: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatus = async (newStatus: string) => {
    if (newStatus === currentStatus || isLoading) return;
    
    setIsLoading(true);
    console.log(`Attempting to update order ${orderId} status from ${currentStatus} to ${newStatus}`);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orderStatusCounts"] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] })
      ]);

      toast({
        title: "Status Updated",
        description: `Order status has been changed to ${newStatus}`,
      });

      console.log(`Successfully updated order ${orderId} status to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStatus, isLoading };
};