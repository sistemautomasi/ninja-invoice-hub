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
      bgGradient: "bg-gradient-to-br from-blue-500/5 via-blue-50/50 to-white",
      borderColor: "border-blue-100/50",
      shadowColor: "shadow-blue-500/20",
      iconGradient: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      status: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-emerald-500",
      bgGradient: "bg-gradient-to-br from-emerald-500/5 via-emerald-50/50 to-white",
      borderColor: "border-emerald-100/50",
      shadowColor: "shadow-emerald-500/20",
      iconGradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    },
    {
      status: "shipped",
      label: "Shipped",
      icon: Truck,
      color: "text-amber-500",
      bgGradient: "bg-gradient-to-br from-amber-500/5 via-amber-50/50 to-white",
      borderColor: "border-amber-100/50",
      shadowColor: "shadow-amber-500/20",
      iconGradient: "bg-gradient-to-br from-amber-400 to-amber-600",
    },
    {
      status: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "text-rose-500",
      bgGradient: "bg-gradient-to-br from-rose-500/5 via-rose-50/50 to-white",
      borderColor: "border-rose-100/50",
      shadowColor: "shadow-rose-500/20",
      iconGradient: "bg-gradient-to-br from-rose-400 to-rose-600",
    },
    {
      status: "returned",
      label: "Returned",
      icon: RotateCcw,
      color: "text-violet-500",
      bgGradient: "bg-gradient-to-br from-violet-500/5 via-violet-50/50 to-white",
      borderColor: "border-violet-100/50",
      shadowColor: "shadow-violet-500/20",
      iconGradient: "bg-gradient-to-br from-violet-400 to-violet-600",
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
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 
              hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${config.bgGradient} 
              ${config.borderColor} border backdrop-blur-sm 
              ${config.shadowColor} shadow-lg
              ${isSelected ? `ring-2 ring-offset-2 ring-${config.color} scale-105 -translate-y-1` : ''}`}
            onClick={() => onStatusClick(config.status)}
          >
            <div className="relative p-4">
              <div className="flex flex-col">
                <div className={`rounded-full p-2 w-fit ${config.iconGradient}`}>
                  <config.icon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-sm font-medium mt-3 text-gray-600">{config.label}</h3>
                <p className={`text-3xl font-bold mt-1 ${config.color}`}>{count}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}