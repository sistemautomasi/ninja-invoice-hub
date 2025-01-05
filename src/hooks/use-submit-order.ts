import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderFormData } from "@/types/order";
import { useToast } from "@/hooks/use-toast";

export const useSubmitOrder = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: OrderFormData) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("You must be logged in to submit an order");
      }

      // First create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: orderData.totalAmount,
          status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Then create the order item
      const { error: itemError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          product_id: orderData.productId,
          quantity: orderData.quantity,
          price_at_time: orderData.priceAtTime,
        });

      if (itemError) throw itemError;

      return order;
    },
    onError: (error: Error) => {
      console.error("Order submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order submitted successfully!",
      });
    },
  });
};