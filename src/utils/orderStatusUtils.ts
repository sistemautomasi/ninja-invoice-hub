export const getStatusColor = (status: string) => {
  const colors = {
    pending: "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
    shipped: "bg-orange-100 text-orange-800",
    cancelled: "bg-red-100 text-red-800",
    returned: "bg-yellow-100 text-yellow-800",
  } as const;

  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];