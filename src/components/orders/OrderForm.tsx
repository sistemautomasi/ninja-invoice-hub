import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { OrderFormData } from "@/types/order";
import { useCurrency } from "@/hooks/use-currency";
import { useToast } from "@/hooks/use-toast";
import { CustomerInfoFields } from "./CustomerInfoFields";
import { ProductSelection } from "./ProductSelection";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShippingCostSection } from "./ShippingCostSection";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
}

interface OrderFormProps {
  products: Product[];
  isSubmitting: boolean;
  onSubmit: (data: OrderFormData) => void;
}

export const OrderForm = ({ products, isSubmitting, onSubmit }: OrderFormProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online_banking'>('online_banking');
  const [shippingCost, setShippingCost] = useState(0);
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  // Fetch user role to determine if they're an admin
  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user role:", error);
          return null;
        }
        
        return data?.role || null;
      } catch (error) {
        console.error("Error in userRole query:", error);
        return null;
      }
    },
    retry: false
  });

  const isAdmin = userRole === 'admin';
  const subtotal = selectedProduct ? selectedProduct.price * quantity : 0;
  const totalAmount = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      customerName: String(formData.get("customerName")),
      email: formData.get("email") ? String(formData.get("email")) : undefined,
      phone: String(formData.get("phone")),
      productId: selectedProduct.id,
      address: String(formData.get("address")),
      district: String(formData.get("district")),
      state: String(formData.get("state")),
      postcode: String(formData.get("postcode")),
      quantity: quantity,
      totalAmount: totalAmount,
      priceAtTime: selectedProduct.price,
      paymentMethod: paymentMethod,
    });
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-left">Order Details</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomerInfoFields />
          
          <ProductSelection
            products={products}
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
            quantity={quantity}
            onQuantityChange={setQuantity}
            formatPrice={formatPrice}
          />

          <div className="space-y-2 text-left">
            <Label>Payment Method</Label>
            <RadioGroup
              defaultValue="online_banking"
              onValueChange={(value) => setPaymentMethod(value as 'cod' | 'online_banking')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online_banking" id="online_banking" />
                <Label htmlFor="online_banking">Online Banking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>
            </RadioGroup>
          </div>

          <ShippingCostSection
            isAdmin={isAdmin}
            paymentMethod={paymentMethod}
            shippingCost={shippingCost}
            onShippingCostChange={setShippingCost}
          />

          <div className="space-y-2 text-left">
            <Label>Order Summary</Label>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                <span>Total:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Order...
              </>
            ) : (
              "Submit Order"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};