import { useState } from "react";
import { Card } from "@/components/ui/card";
import TimePeriodSelect from "@/components/dashboard/TimePeriodSelect";
import SalesChartVisualization from "./SalesChartVisualization";

interface SalesChartContainerProps {
  salesData: Array<{
    name: string;
    sales: number;
  }>;
}

const SalesChartContainer = ({ salesData }: SalesChartContainerProps) => {
  const [timePeriod, setTimePeriod] = useState("last7days");

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Sales Overview</h3>
          <TimePeriodSelect
            value={timePeriod}
            onValueChange={setTimePeriod}
          />
        </div>
        <div className="h-[400px] mt-4">
          <SalesChartVisualization salesData={salesData} />
        </div>
      </div>
    </Card>
  );
};

export default SalesChartContainer;