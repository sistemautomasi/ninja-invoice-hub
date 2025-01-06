import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { CostSummaryCards } from "@/components/costs/CostSummaryCards";
import { AddCostForm } from "@/components/costs/AddCostForm";
import { CostList } from "@/components/costs/CostList";
import { ShippingRatesCard } from "@/components/costs/ShippingRatesCard";
import type { Cost } from "@/types/costs";

const Costs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | undefined>();

  const { data: costs, isLoading } = useQuery({
    queryKey: ["costs"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("business_costs")
        .select("*")
        .eq('cost_type', 'advertising')
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as Cost[];
    },
  });

  const addCost = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const cost = {
        user_id: user.id,
        cost_type: String(formData.get("type")),
        amount: Number(formData.get("amount")),
        description: String(formData.get("description")),
        date: String(formData.get("date")),
      };

      if (editingCost) {
        const { error } = await supabase
          .from("business_costs")
          .update(cost)
          .eq("id", editingCost.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("business_costs")
          .insert([cost]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costs"] });
      setIsAdding(false);
      setEditingCost(undefined);
      toast({
        title: "Success",
        description: editingCost ? "Cost updated successfully" : "Cost added successfully",
      });
    },
    onError: (error) => {
      console.error("Error managing cost:", error);
      toast({
        title: "Error",
        description: editingCost ? "Failed to update cost" : "Failed to add cost",
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
    if (!editingCost) {
      form.reset();
    }
  };

  const handleEdit = (cost: Cost) => {
    setEditingCost(cost);
    setIsAdding(true);
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
      <h1 className="text-3xl font-bold text-left">Business Costs</h1>

      <ShippingRatesCard />

      <CostSummaryCards costs={costs} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-left">Advertising Costs</CardTitle>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)}>
                Add Cost
              </Button>
            )}
            {isAdding && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setEditingCost(undefined);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="mb-6">
              <AddCostForm 
                onSubmit={handleSubmit}
                isLoading={addCost.isPending}
                editingCost={editingCost}
              />
            </div>
          )}

          <CostList 
            costs={costs}
            onDelete={(id) => deleteCost.mutate(id)}
            onEdit={handleEdit}
            isDeleting={deleteCost.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Costs;