import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { OrderForm } from "@/components/orders/OrderForm";
import { OrderFormData } from "@/types/order";

const SubmitOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, stock_quantity");
      if (error) throw error;
      return data;
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderFormData) => {
      const selectedProduct = products?.find(p => p.id === orderData.productId);
      if (!selectedProduct) throw new Error("Product not found");

      const total_amount = selectedProduct.price * orderData.quantity;

      // First create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{ total_amount, status: "pending" }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Then create the order item
      const { error: itemError } = await supabase.from("order_items").insert([
        {
          order_id: order.id,
          product_id: orderData.productId,
          quantity: orderData.quantity,
          price_at_time: selectedProduct.price,
        },
      ]);

      if (itemError) throw itemError;

      return order;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order submitted successfully!",
      });
      navigate("/orders");
    },
    onError: (error) => {
      console.error("Order submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-8 text-left">Submit Order</h1>
      {products && (
        <OrderForm
          products={products}
          isSubmitting={createOrderMutation.isPending}
          onSubmit={(data) => createOrderMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default SubmitOrder;