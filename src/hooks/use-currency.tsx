import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrency = () => {
  const { data: currencySettings } = useQuery({
    queryKey: ["currency-settings"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No authenticated session found, using default currency");
        return "USD";
      }

      const { data: settings, error } = await supabase
        .from("settings")
        .select("setting_value")
        .eq("setting_key", "default_currency")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching currency settings:", error);
        throw error;
      }

      console.log("Fetched currency settings:", settings);
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