import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface ShippingCostSectionProps {
  isAdmin: boolean;
  paymentMethod: 'cod' | 'online_banking';
  shippingCost: number;
  onShippingCostChange: (cost: number) => void;
}

export const ShippingCostSection = ({
  isAdmin,
  paymentMethod,
  shippingCost,
  onShippingCostChange,
}: ShippingCostSectionProps) => {
  // Fetch shipping rates based on payment method
  const { data: shippingRates } = useQuery({
    queryKey: ["shippingRates", paymentMethod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_costs")
        .select("amount")
        .eq("cost_type", paymentMethod === 'cod' ? 'shipping_cod' : 'shipping_online')
        .maybeSingle();

      if (error) {
        console.error("Error fetching shipping rates:", error);
        return null;
      }

      return data?.amount || 0;
    }
  });

  // Update shipping cost when payment method changes or rates are fetched
  useEffect(() => {
    if (shippingRates !== null && shippingRates !== undefined) {
      onShippingCostChange(Number(shippingRates));
    }
  }, [shippingRates, paymentMethod, onShippingCostChange]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-2 text-left">
      <Label htmlFor="shippingCost">Shipping Cost</Label>
      <Input
        id="shippingCost"
        type="number"
        step="0.01"
        value={shippingCost}
        onChange={(e) => onShippingCostChange(Number(e.target.value))}
      />
    </div>
  );
};