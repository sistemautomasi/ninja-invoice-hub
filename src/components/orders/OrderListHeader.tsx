import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderListHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  timePeriod: string;
  onTimePeriodChange: (value: string) => void;
}

export const OrderListHeader = ({ 
  search, 
  onSearchChange,
  timePeriod,
  onTimePeriodChange 
}: OrderListHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <Select value={timePeriod} onValueChange={onTimePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="last_week">Last Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search orders..."
          className="max-w-xs"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};