import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import TimePeriodSelect from "@/components/dashboard/TimePeriodSelect";
import { AddAdMetricsForm } from "@/components/advertising/AddAdMetricsForm";
import { AdMetricsTable } from "@/components/advertising/AdMetricsTable";
import { AdMetricsSummary } from "@/components/advertising/AdMetricsSummary";
import { useAdvertisingMetrics } from "@/hooks/use-advertising-metrics";

const AdvertisingReport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("last7days");

  const { data: overallMetrics, isLoading } = useAdvertisingMetrics(selectedPeriod);

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
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

  if (isLoading || isLoadingMetrics) {
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

      <AdMetricsSummary metrics={{
        roas: overallMetrics?.roas || 0,
        netRevenue: overallMetrics?.netRevenue || 0,
        costPerPurchase: overallMetrics?.costPerPurchase || 0,
        ctr: overallMetrics?.ctr || 0,
      }} />

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