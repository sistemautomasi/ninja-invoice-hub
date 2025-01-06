import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface OrderStatusActionProps {
  orderId: string;
  currentStatus: string;
}

export const OrderStatusAction = ({ orderId, currentStatus }: OrderStatusActionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  // Keep local state in sync with prop changes
  useEffect(() => {
    console.log(`Action dropdown received new status: ${currentStatus}`);
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" },
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === selectedStatus || isLoading) return;
    
    setIsLoading(true);
    console.log(`Attempting to update order ${orderId} status from ${selectedStatus} to ${newStatus}`);
    const previousStatus = selectedStatus;

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Force immediate cache invalidation
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orderStatusCounts"] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] })
      ]);

      setSelectedStatus(newStatus);

      toast({
        title: "Status Updated",
        description: `Order status has been changed to ${newStatus}`,
      });

      console.log(`Successfully updated order ${orderId} status to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      
      // Revert UI state
      setSelectedStatus(previousStatus);
      
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });

      console.error(`Failed to update order ${orderId} status from ${previousStatus} to ${newStatus}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Select
        value={selectedStatus}
        onValueChange={handleStatusChange}
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
