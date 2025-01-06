import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CirclePlus, CheckCircle, Truck, RotateCcw, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface StatusCount {
  status: string;
  count: number;
}

interface OrderStatusSummaryProps {
  onStatusClick: (status: string) => void;
  selectedStatus: string | null;
}

export function OrderStatusSummary({ onStatusClick, selectedStatus }: OrderStatusSummaryProps) {
  const queryClient = useQueryClient();
  
  const { data: statusCounts, isLoading, error } = useQuery({
    queryKey: ["orderStatusCounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("status");

      if (error) throw error;

      if (!data) return [];

      const counts = data.reduce((acc: Record<string, number>, order) => {
        // Count 'pending' orders as 'new'
        const status = order.status === 'pending' ? 'new' : order.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts).map(([status, count]) => ({ 
        status, 
        count 
      }));
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orderStatusCounts"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const statusConfigs = [
    {
      status: "new",
      label: "New Orders",
      icon: CirclePlus,
      color: "text-gray-900",
      bgColor: "bg-white",
      iconColor: "text-purple-500", // Changed to purple
    },
    {
      status: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-gray-900",
      bgColor: "bg-white",
      iconColor: "text-green-500", // Changed to green
    },
    {
      status: "shipped",
      label: "Shipped",
      icon: Truck,
      color: "text-gray-900",
      bgColor: "bg-white",
      iconColor: "text-orange-500", // Changed to orange
    },
    {
      status: "returned",
      label: "Returned",
      icon: RotateCcw,
      color: "text-gray-900",
      bgColor: "bg-white",
      iconColor: "text-red-500", // Changed to red
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading order statistics
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {statusConfigs.map((config) => {
        // For the "new" status, include both "new" and "pending" counts
        const count = config.status === "new"
          ? (statusCounts?.filter(s => s.status === "new" || s.status === "pending").reduce((sum, s) => sum + s.count, 0) || 0)
          : (statusCounts?.find(s => s.status === config.status)?.count || 0);
        
        const isSelected = selectedStatus === config.status;
        
        return (
          <Card
            key={config.status}
            className={`
              relative overflow-hidden cursor-pointer transition-all
              ${config.bgColor} shadow-sm hover:shadow-md
              ${isSelected ? 'ring-1 ring-gray-200' : ''}
            `}
            onClick={() => onStatusClick(config.status)}
          >
            <div className="p-6">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {config.label}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold text-gray-900">
                    {count}
                  </p>
                  <config.icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}