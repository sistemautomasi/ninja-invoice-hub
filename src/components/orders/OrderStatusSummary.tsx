import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Package, CheckCircle, Truck, Check, X, ArrowLeftRight, Loader2 } from "lucide-react";
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
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      lightBgColor: "hover:bg-blue-50/80",
    },
    {
      status: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      lightBgColor: "hover:bg-purple-50/80",
    },
    {
      status: "shipped",
      label: "Shipping",
      icon: Truck,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      lightBgColor: "hover:bg-yellow-50/80",
    },
    {
      status: "completed",
      label: "Completed",
      icon: Check,
      color: "text-green-600",
      bgColor: "bg-green-50",
      lightBgColor: "hover:bg-green-50/80",
    },
    {
      status: "cancelled",
      label: "Cancelled",
      icon: X,
      color: "text-red-600",
      bgColor: "bg-red-50",
      lightBgColor: "hover:bg-red-50/80",
    },
    {
      status: "returned",
      label: "Returned",
      icon: ArrowLeftRight,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      lightBgColor: "hover:bg-orange-50/80",
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              ${config.bgColor} border-0 shadow-none
              ${isSelected ? 'ring-2 ring-gray-200' : ''}
              ${config.lightBgColor}
            `}
            onClick={() => onStatusClick(config.status)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <config.icon className={`h-5 w-5 ${config.color}`} />
                  <h3 className="text-sm font-medium text-gray-600">
                    {config.label}
                  </h3>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {count}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}