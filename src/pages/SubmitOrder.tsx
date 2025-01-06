import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { OrderForm } from "@/components/orders/OrderForm";
import { supabase } from "@/integrations/supabase/client";
import { useSubmitOrder } from "@/hooks/use-submit-order";

const SubmitOrder = () => {
  const navigate = useNavigate();
  const submitOrderMutation = useSubmitOrder();

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

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-8 text-left bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
        Submit Order
      </h1>
      {products && (
        <OrderForm
          products={products}
          isSubmitting={submitOrderMutation.isPending}
          onSubmit={(data) => {
            submitOrderMutation.mutate(data, {
              onSuccess: () => navigate("/orders"),
            });
          }}
        />
      )}
    </div>
  );
};

export default SubmitOrder;