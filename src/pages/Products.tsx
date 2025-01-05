import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductList } from "@/components/products/ProductList";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
}

const Products = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("Fetching products...");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      console.log("Products fetched:", data);
      return data as Product[];
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, "id">) => {
      const { data, error } = await supabase
        .from("products")
        .insert([newProduct])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
      setIsDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast.error("Failed to create product: " + error.message);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          stock_quantity: product.stock_quantity,
        })
        .eq("id", product.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      setIsDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast.error("Failed to update product: " + error.message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete product: " + error.message);
    },
  });

  const handleSubmit = (formData: FormData) => {
    const productData = {
      name: String(formData.get("name")),
      description: String(formData.get("description")),
      price: Number(formData.get("price")),
      stock_quantity: Number(formData.get("stock_quantity")),
    };

    if (selectedProduct) {
      updateProductMutation.mutate({ ...productData, id: selectedProduct.id });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          Products
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setSelectedProduct(null)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <ProductForm
            selectedProduct={selectedProduct}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>

      <ProductList
        products={products || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteProductMutation.mutate(id)}
      />
    </div>
  );
};

export default Products;