import { Card } from "@/components/ui/card";
import SalesChartVisualization from "./SalesChartVisualization";

interface SalesChartContainerProps {
  data: Array<{
    name: string;
    sales: number;
    profit: number;
  }>;
}

const SalesChartContainer = ({ data }: SalesChartContainerProps) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Sales & Profit Overview</h3>
        </div>
        <div className="h-[400px] mt-4">
          <SalesChartVisualization data={data} />
        </div>
      </div>
    </Card>
  );
};

export default SalesChartContainer;