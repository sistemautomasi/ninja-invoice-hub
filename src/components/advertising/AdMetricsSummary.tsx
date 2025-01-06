import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";

interface AdMetricsSummaryProps {
  metrics: {
    roas: number;
    netRevenue: number;
    costPerPurchase: number;
    ctr: number;
  };
}

export const AdMetricsSummary = ({ metrics }: AdMetricsSummaryProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ROAS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.roas.toFixed(2)}x
          </div>
          <p className="text-xs text-muted-foreground">
            Return on Ad Spend (Sales/Ad Spend)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(metrics.netRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Sales minus Ad Spend
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cost per Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(metrics.costPerPurchase)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average cost per conversion
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CTR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.ctr.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Click-through Rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
};