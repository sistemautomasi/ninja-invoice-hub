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

      // First create the order with customer information
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: orderData.totalAmount,
          status: "pending",
          customer_name: orderData.customerName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          district: orderData.district,
          state: orderData.state,
          postcode: orderData.postcode,
          platform: orderData.paymentMethod // Store payment method in platform field
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

      // Create a shipping cost record if COD
      if (orderData.paymentMethod === 'cod') {
        const { error: costError } = await supabase
          .from("business_costs")
          .insert({
            user_id: user.id,
            cost_type: 'shipping',
            amount: 15,
            description: `Shipping cost for order ${order.order_number}`,
            date: new Date().toISOString().split('T')[0]
          });

        if (costError) throw costError;
      }

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