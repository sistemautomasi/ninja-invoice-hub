import { Input } from "@/components/ui/input";

interface OrderListHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const OrderListHeader = ({ search, onSearchChange }: OrderListHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Order List</h1>
      <Input
        placeholder="Search orders..."
        className="max-w-xs"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};