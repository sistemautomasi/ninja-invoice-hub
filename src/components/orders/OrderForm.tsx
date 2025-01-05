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
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

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
      totalAmount: selectedProduct.price * quantity,
      priceAtTime: selectedProduct.price,
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