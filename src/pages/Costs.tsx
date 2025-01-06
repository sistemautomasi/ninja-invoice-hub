import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Package, Megaphone, Loader2, X } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

type Cost = {
  id: string;
  cost_type: string;
  amount: number;
  description: string;
  date: string;
};

const Costs = () => {
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const { data: costs, isLoading } = useQuery({
    queryKey: ["costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_costs")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Cost[];
    },
  });

  const addCost = useMutation({
    mutationFn: async (formData: FormData) => {
      const cost = {
        cost_type: String(formData.get("type")),
        amount: Number(formData.get("amount")),
        description: String(formData.get("description")),
        date: String(formData.get("date")),
      };

      const { error } = await supabase
        .from("business_costs")
        .insert([cost]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costs"] });
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Cost added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add cost",
        variant: "destructive",
      });
    },
  });

  const deleteCost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("business_costs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costs"] });
      toast({
        title: "Success",
        description: "Cost deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete cost",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    addCost.mutate(new FormData(form));
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
        Business Costs
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Advertising Costs</CardTitle>
            <Megaphone className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(costs?.filter(c => c.cost_type === 'advertising')
                .reduce((sum, cost) => sum + Number(cost.amount), 0) || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Shipping Costs</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(costs?.filter(c => c.cost_type === 'shipping')
                .reduce((sum, cost) => sum + Number(cost.amount), 0) || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(costs?.reduce((sum, cost) => sum + Number(cost.amount), 0) || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost History</CardTitle>
            <Button onClick={() => setIsAdding(!isAdding)}>
              {isAdding ? "Cancel" : "Add Cost"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Cost Type</Label>
                  <select
                    id="type"
                    name="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    required
                  >
                    <option value="advertising">Advertising</option>
                    <option value="shipping">Shipping</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                  />
                </div>
              </div>
              <Button type="submit" disabled={addCost.isPending}>
                {addCost.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Add Cost
              </Button>
            </form>
          )}

          <div className="space-y-4">
            {costs?.map((cost) => (
              <div
                key={cost.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{cost.cost_type}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(cost.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cost.description}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{formatPrice(cost.amount)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCost.mutate(cost.id)}
                    disabled={deleteCost.isPending}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Costs;