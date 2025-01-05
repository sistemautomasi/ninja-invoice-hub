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

  const { data: currencySettings, isLoading } = useQuery({
    queryKey: ["settings", "currency"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
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

      return data;
    },
  });

  const updateCurrency = useMutation({
    mutationFn: async (newCurrency: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated session");
      }

      // First try to get the existing setting
      const { data: existingSetting } = await supabase
        .from("settings")
        .select("id")
        .eq("setting_key", "default_currency")
        .maybeSingle();

      const { error } = await supabase
        .from("settings")
        .upsert({
          id: existingSetting?.id, // Include the id if it exists
          setting_key: "default_currency",
          setting_value: newCurrency,
          setting_type: "string",
        });

      if (error) {
        console.error("Error updating currency:", error);
        throw error;
      }
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
        description: "Failed to update currency settings",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Default Currency</Label>
          <Select
            disabled={isLoading}
            value={currencySettings?.setting_value || DEFAULT_CURRENCY}
            onValueChange={(value) => updateCurrency.mutate(value)}
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