import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ShippingRatesCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: shippingRates, isLoading } = useQuery({
    queryKey: ["shipping-rates"],
    queryFn: async () => {
      const { data: costs, error } = await supabase
        .from("business_costs")
        .select("*")
        .in("cost_type", ["shipping_cod", "shipping_online"])
        .order("cost_type", { ascending: true });

      if (error) throw error;

      const rates: { [key: string]: number } = {};
      costs?.forEach(cost => {
        rates[cost.cost_type] = Number(cost.amount);
      });

      return rates;
    },
  });

  const updateRate = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete existing rates
      await supabase
        .from("business_costs")
        .delete()
        .in("cost_type", ["shipping_cod", "shipping_online"]);

      // Insert new rates
      const costs = [
        {
          user_id: user.id,
          cost_type: "shipping_cod",
          amount: Number(formData.get("cod_rate")),
          description: "Fixed shipping rate for Cash on Delivery",
        },
        {
          user_id: user.id,
          cost_type: "shipping_online",
          amount: Number(formData.get("online_rate")),
          description: "Fixed shipping rate for Online Banking",
        },
      ];

      const { error } = await supabase
        .from("business_costs")
        .insert(costs);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Shipping rates updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating shipping rates:", error);
      toast({
        title: "Error",
        description: "Failed to update shipping rates",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateRate.mutate(new FormData(e.target as HTMLFormElement));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shipping Rates</CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Update Rates
            </Button>
          )}
          {isEditing && (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cod_rate">Cash on Delivery Rate</Label>
                <Input
                  id="cod_rate"
                  name="cod_rate"
                  type="number"
                  step="0.01"
                  defaultValue={shippingRates?.shipping_cod || 0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="online_rate">Online Banking Rate</Label>
                <Input
                  id="online_rate"
                  name="online_rate"
                  type="number"
                  step="0.01"
                  defaultValue={shippingRates?.shipping_online || 0}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={updateRate.isPending}>
              {updateRate.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Rates
            </Button>
          </form>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Cash on Delivery Rate</Label>
              <p className="text-2xl font-bold">
                {shippingRates?.shipping_cod || 0}
              </p>
            </div>
            <div>
              <Label>Online Banking Rate</Label>
              <p className="text-2xl font-bold">
                {shippingRates?.shipping_online || 0}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};