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
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface OrderStatusActionProps {
  orderId: string;
  currentStatus: string;
}

export const OrderStatusAction = ({ orderId, currentStatus }: OrderStatusActionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returned" },
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Broadcast the status change
      const channel = supabase.channel(`order-status-${orderId}`);
      await channel.subscribe();
      
      // Invalidate queries to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ["orderStatusCounts"] });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast({
        title: "Status Updated",
        description: `Order status has been changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Select
        defaultValue={currentStatus}
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