import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrency = () => {
  const { data: currencySettings } = useQuery({
    queryKey: ["currency-settings"],
    queryFn: async () => {
      const { data: settings, error } = await supabase
        .from("settings")
        .select("setting_value")
        .eq("setting_key", "default_currency")
        .single();

      if (error) throw error;
      return settings?.setting_value || "USD";
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencySettings || "USD",
    }).format(price);
  };

  return {
    currency: currencySettings || "USD",
    formatPrice,
  };
};