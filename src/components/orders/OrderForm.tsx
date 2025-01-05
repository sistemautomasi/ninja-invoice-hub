import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { OrderFormData } from "@/types/order";
import { useCurrency } from "@/hooks/use-currency";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

const MALAYSIAN_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Labuan",
  "Wilayah Persekutuan Putrajaya"
];

export const OrderForm = ({ products, isSubmitting, onSubmit }: OrderFormProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit an order",
          variant: "destructive",
        });
        return;
      }

      if (!selectedProduct) {
        toast({
          title: "Error",
          description: "Please select a product",
          variant: "destructive",
        });
        return;
      }

      const totalAmount = selectedProduct.price * quantity;

      // Create the order with explicit user_id
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      // Create the order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: selectedProduct.id,
          quantity: quantity,
          price_at_time: selectedProduct.price
        });

      if (itemError) {
        console.error('Order item creation error:', itemError);
        throw itemError;
      }

      toast({
        title: "Success",
        description: "Order submitted successfully!",
      });

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
      });
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-left">Order Details</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="customerName" className="text-left">Customer Name *</Label>
            <Input id="customerName" name="customerName" required />
          </div>
          
          <div className="space-y-2 text-left">
            <Label htmlFor="email" className="text-left">Email (optional)</Label>
            <Input id="email" name="email" type="email" />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="phone" className="text-left">Phone *</Label>
            <Input id="phone" name="phone" required />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="address" className="text-left">Address *</Label>
            <Input id="address" name="address" required />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="district" className="text-left">District *</Label>
            <Input id="district" name="district" required />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="state" className="text-left">State *</Label>
            <select
              id="state"
              name="state"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a state</option>
              {MALAYSIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="postcode" className="text-left">Postcode *</Label>
            <Input id="postcode" name="postcode" required />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="product" className="text-left">Product *</Label>
            <select
              id="product"
              name="product"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              onChange={(e) => {
                const product = products.find(p => p.id === e.target.value);
                setSelectedProduct(product || null);
              }}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({formatPrice(product.price)})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="quantity" className="text-left">Quantity *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2 text-left">
            <Label className="text-left">Total Price</Label>
            <div className="text-lg font-semibold">{formatPrice(totalPrice)}</div>
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
