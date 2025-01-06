import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePeriodSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TimePeriodSelect = ({ value, onValueChange }: TimePeriodSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="yesterday">Yesterday</SelectItem>
        <SelectItem value="last7days">Last 7 Days</SelectItem>
        <SelectItem value="last30days">Last 30 Days</SelectItem>
        <SelectItem value="thisMonth">This Month</SelectItem>
        <SelectItem value="lastMonth">Last Month</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimePeriodSelect;