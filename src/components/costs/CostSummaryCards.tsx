import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Megaphone } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { Cost } from "@/types/costs";

interface CostSummaryCardsProps {
  costs: Cost[] | undefined;
}

export const CostSummaryCards = ({ costs }: CostSummaryCardsProps) => {
  const { formatPrice } = useCurrency();

  const calculateTotal = (type?: string) => {
    if (!costs) return 0;
    return costs
      .filter(c => !type || c.cost_type === type)
      .reduce((sum, cost) => sum + Number(cost.amount), 0);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Advertising Costs</CardTitle>
          <Megaphone className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(calculateTotal('advertising'))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Shipping Costs</CardTitle>
          <Package className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(calculateTotal('shipping'))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
          <DollarSign className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(calculateTotal())}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};