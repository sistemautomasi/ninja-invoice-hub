import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import TimePeriodSelect from "@/components/dashboard/TimePeriodSelect";
import { AddAdMetricsForm } from "@/components/advertising/AddAdMetricsForm";
import { AdMetricsTable } from "@/components/advertising/AdMetricsTable";

const AdvertisingReport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("last7days");

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["adMetrics", selectedPeriod],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("ad_metrics")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addMetrics = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const metrics = {
        user_id: user.id,
        date: String(formData.get("date")),
        platform: String(formData.get("platform")),
        campaign_name: String(formData.get("campaign_name")),
        ad_spend: Number(formData.get("ad_spend")),
        impressions: Number(formData.get("impressions")),
        clicks: Number(formData.get("clicks")),
        conversions: Number(formData.get("conversions")),
        revenue: Number(formData.get("revenue")),
      };

      const { error } = await supabase
        .from("ad_metrics")
        .insert([metrics]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adMetrics"] });
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Ad metrics added successfully",
      });
    },
    onError: (error) => {
      console.error("Error adding ad metrics:", error);
      toast({
        title: "Error",
        description: "Failed to add ad metrics",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Advertising Report</h1>
        <TimePeriodSelect 
          value={selectedPeriod} 
          onValueChange={setSelectedPeriod} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics && metrics.length > 0
                ? `${((metrics.reduce((acc, m) => acc + Number(m.revenue), 0) / 
                    metrics.reduce((acc, m) => acc + Number(m.ad_spend), 0)) * 100).toFixed(2)}%`
                : "0%"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics && metrics.length > 0
                ? `$${(metrics.reduce((acc, m) => acc + Number(m.ad_spend), 0) / 
                    metrics.reduce((acc, m) => acc + Number(m.conversions), 0)).toFixed(2)}`
                : "$0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics && metrics.length > 0
                ? `${((metrics.reduce((acc, m) => acc + Number(m.clicks), 0) / 
                    metrics.reduce((acc, m) => acc + Number(m.impressions), 0)) * 100).toFixed(2)}%`
                : "0%"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ad Metrics</CardTitle>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)}>
                Add Metrics
              </Button>
            )}
            {isAdding && (
              <Button 
                variant="outline" 
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="mb-6">
              <AddAdMetricsForm 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  addMetrics.mutate(new FormData(form));
                  form.reset();
                }}
                isLoading={addMetrics.isPending}
              />
            </div>
          )}

          <AdMetricsTable metrics={metrics} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisingReport;