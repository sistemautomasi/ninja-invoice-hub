import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { OrderFormData } from "@/types/order";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      customerName: String(formData.get("customerName")),
      email: formData.get("email") ? String(formData.get("email")) : undefined,
      phone: String(formData.get("phone")),
      productId: String(formData.get("product")),
      address: String(formData.get("address")),
      district: String(formData.get("district")),
      state: String(formData.get("state")),
      postcode: String(formData.get("postcode")),
      quantity: Number(quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input id="customerName" name="customerName" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" name="phone" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product">Product *</Label>
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
                {product.name} (${product.price})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input id="address" name="address" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District *</Label>
          <Input id="district" name="district" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
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

        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode *</Label>
          <Input id="postcode" name="postcode" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
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
      </div>

      {selectedProduct && (
        <Card className="mt-6 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">Product Total:</span>
              <span className="text-lg font-bold">
                ${(selectedProduct.price * quantity).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
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
  );
};