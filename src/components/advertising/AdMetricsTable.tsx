import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useCurrency } from "@/hooks/use-currency";

interface AdMetric {
  id: string;
  date: string;
  platform: string;
  campaign_name: string;
  ad_spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface AdMetricsTableProps {
  metrics: AdMetric[] | null;
}

export const AdMetricsTable = ({ metrics }: AdMetricsTableProps) => {
  const { formatPrice } = useCurrency();

  if (!metrics || metrics.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No ad metrics found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Platform</TableHead>
          <TableHead>Campaign</TableHead>
          <TableHead className="text-right">Spend</TableHead>
          <TableHead className="text-right">Sales</TableHead>
          <TableHead className="text-right">Net Revenue</TableHead>
          <TableHead className="text-right">ROAS</TableHead>
          <TableHead className="text-right">Impressions</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
          <TableHead className="text-right">Conv.</TableHead>
          <TableHead className="text-right">CPP</TableHead>
          <TableHead className="text-right">CTR</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((metric) => {
          const netRevenue = metric.revenue - metric.ad_spend;
          // Calculate ROAS as a ratio (not percentage)
          const roas = metric.ad_spend > 0 ? (metric.revenue / metric.ad_spend).toFixed(2) : '0';
          const cpp = (metric.ad_spend / metric.conversions).toFixed(2);
          const ctr = ((metric.clicks / metric.impressions) * 100).toFixed(2);

          return (
            <TableRow key={metric.id}>
              <TableCell>{format(new Date(metric.date), "MMM d, yyyy")}</TableCell>
              <TableCell className="capitalize">{metric.platform}</TableCell>
              <TableCell>{metric.campaign_name}</TableCell>
              <TableCell className="text-right">{formatPrice(metric.ad_spend)}</TableCell>
              <TableCell className="text-right">{formatPrice(metric.revenue)}</TableCell>
              <TableCell className="text-right">{formatPrice(netRevenue)}</TableCell>
              <TableCell className="text-right">{roas}x</TableCell>
              <TableCell className="text-right">{metric.impressions.toLocaleString()}</TableCell>
              <TableCell className="text-right">{metric.clicks.toLocaleString()}</TableCell>
              <TableCell className="text-right">{metric.conversions}</TableCell>
              <TableCell className="text-right">{formatPrice(Number(cpp))}</TableCell>
              <TableCell className="text-right">{ctr}%</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};