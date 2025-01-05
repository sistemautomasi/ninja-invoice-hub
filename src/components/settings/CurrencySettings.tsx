import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const SUPPORTED_CURRENCIES = [
  { value: "MYR", label: "Malaysian Ringgit (MYR)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "SGD", label: "Singapore Dollar (SGD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

const DEFAULT_CURRENCY = "MYR";

export const CurrencySettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to change currency settings.",
          variant: "destructive",
        });
      }
    };
    checkAuth();
  }, [toast]);

  const { data: currencySettings, isLoading } = useQuery({
    queryKey: ["settings", "currency"],
    queryFn: async () => {
      console.log("Fetching currency settings...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No authenticated session found");
        throw new Error("No authenticated session");
      }

      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("setting_key", "default_currency")
        .maybeSingle();

      if (error) {
        console.error("Error fetching currency settings:", error);
        throw error;
      }

      console.log("Fetched currency settings:", data);
      return data;
    },
    retry: false,
    meta: {
      errorMessage: "Failed to load currency settings. Please ensure you're signed in.",
      onError: (error: Error) => {
        console.error("Error in currency settings query:", error);
        toast({
          title: "Error",
          description: "Failed to load currency settings. Please ensure you're signed in.",
          variant: "destructive",
        });
      }
    }
  });

  const updateCurrency = useMutation({
    mutationFn: async (newCurrency: string) => {
      console.log("Updating currency to:", newCurrency);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No authenticated session found");
        throw new Error("No authenticated session");
      }

      const { error: upsertError } = await supabase
        .from("settings")
        .upsert({
          setting_key: "default_currency",
          setting_value: newCurrency,
          setting_type: "string",
        });

      if (upsertError) {
        console.error("Error updating currency:", upsertError);
        throw upsertError;
      }

      console.log("Currency updated successfully to:", newCurrency);
      return newCurrency;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "currency"] });
      toast({
        title: "Success",
        description: "Currency settings updated successfully",
      });
    },
    onError: (error) => {
      console.error("Failed to update currency:", error);
      toast({
        title: "Error",
        description: "Failed to update currency settings. Please ensure you're signed in.",
        variant: "destructive",
      });
    },
  });

  const handleCurrencyChange = (value: string) => {
    console.log("Attempting to update currency to:", value);
    updateCurrency.mutate(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Default Currency</Label>
          <Select
            disabled={isLoading || updateCurrency.isPending}
            value={currencySettings?.setting_value || DEFAULT_CURRENCY}
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger id="currency" className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};