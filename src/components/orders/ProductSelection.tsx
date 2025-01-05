import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
}

interface ProductSelectionProps {
  products: Product[];
  selectedProduct: Product | null;
  onProductSelect: (product: Product | null) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  formatPrice: (price: number) => string;
}

export const ProductSelection = ({
  products,
  selectedProduct,
  onProductSelect,
  quantity,
  onQuantityChange,
  formatPrice,
}: ProductSelectionProps) => {
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <>
      <div className="space-y-2 text-left">
        <Label htmlFor="product">Product *</Label>
        <select
          id="product"
          name="product"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
          onChange={(e) => {
            const product = products.find(p => p.id === e.target.value);
            onProductSelect(product || null);
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
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2 text-left">
        <Label>Total Price</Label>
        <div className="text-lg font-semibold">{formatPrice(totalPrice)}</div>
      </div>
    </>
  );
};