import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CirclePlus, CheckCircle, Truck, XCircle, RotateCcw, Loader2 } from "lucide-react";
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
        acc[order.status] = (acc[order.status] || 0) + 1;
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
        () => {
          // Invalidate the query to trigger a refetch
          void queryClient.invalidateQueries({ queryKey: ["orderStatusCounts"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const statusConfigs = [
    {
      status: "pending",
      label: "New Orders",
      icon: CirclePlus,
      color: "text-blue-500",
      bgColor: "bg-blue-50/50",
      borderColor: "border-blue-100",
      gradient: "from-blue-500/10 to-blue-50/50",
    },
    {
      status: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50/50",
      borderColor: "border-green-100",
      gradient: "from-green-500/10 to-green-50/50",
    },
    {
      status: "shipped",
      label: "Shipped",
      icon: Truck,
      color: "text-orange-500",
      bgColor: "bg-orange-50/50",
      borderColor: "border-orange-100",
      gradient: "from-orange-500/10 to-orange-50/50",
    },
    {
      status: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50/50",
      borderColor: "border-red-100",
      gradient: "from-red-500/10 to-red-50/50",
    },
    {
      status: "returned",
      label: "Returned",
      icon: RotateCcw,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50/50",
      borderColor: "border-yellow-100",
      gradient: "from-yellow-500/10 to-yellow-50/50",
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {statusConfigs.map((config) => {
        const count = statusCounts?.find(s => s.status === config.status)?.count || 0;
        const isSelected = selectedStatus === config.status;
        
        return (
          <Card
            key={config.status}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              config.bgColor
            } ${config.borderColor} ${
              isSelected ? 'ring-2 ring-offset-2 ring-primary shadow-lg scale-105' : ''
            }`}
            onClick={() => onStatusClick(config.status)}
          >
            <div className="absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-50" />
            <div className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <config.icon className={`h-8 w-8 ${config.color} transition-transform duration-300 group-hover:scale-110`} />
                  <h3 className="text-sm font-medium mt-2 text-gray-700">{config.label}</h3>
                  <p className={`text-2xl font-bold mt-1 ${config.color}`}>{count}</p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}