import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isManual, setIsManual] = useState(false);

  // Fetch shipping rates based on payment method
  const { data: shippingRates } = useQuery({
    queryKey: ["shippingRates", paymentMethod],
    queryFn: async () => {
      setIsLoading(true);
      try {
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
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Update shipping cost when payment method changes or rates are fetched
  useEffect(() => {
    if (!isManual && shippingRates !== null && shippingRates !== undefined) {
      onShippingCostChange(Number(shippingRates));
    }
  }, [shippingRates, paymentMethod, onShippingCostChange, isManual]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="shippingCost">Shipping Cost</Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor="manual-mode">Manual Override</Label>
          <Switch
            id="manual-mode"
            checked={isManual}
            onCheckedChange={setIsManual}
          />
        </div>
      </div>
      
      <Input
        id="shippingCost"
        type="number"
        step="0.01"
        value={shippingCost}
        onChange={(e) => onShippingCostChange(Number(e.target.value))}
        disabled={isLoading || !isManual}
        className={isManual ? "bg-white" : "bg-gray-100"}
      />
      
      {!isManual && isLoading && (
        <p className="text-sm text-muted-foreground">Loading default shipping rates...</p>
      )}
      
      {!isManual && !isLoading && shippingRates !== null && (
        <p className="text-sm text-muted-foreground">
          Using default shipping rate: {shippingRates}
        </p>
      )}
    </div>
  );
};