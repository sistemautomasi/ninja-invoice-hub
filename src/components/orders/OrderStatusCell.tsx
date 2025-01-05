import { cn } from "@/lib/utils";

interface OrderStatusCellProps {
  status: string;
}

export const OrderStatusCell = ({ status }: OrderStatusCellProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      shipped: "bg-orange-100 text-orange-800",
      cancelled: "bg-red-100 text-red-800",
      returned: "bg-yellow-100 text-yellow-800",
    } as const;

    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        getStatusColor(status)
      )}
    >
      {status}
    </span>
  );
};