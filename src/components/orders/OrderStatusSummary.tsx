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
      status: "pending",
      label: "New Orders",
      icon: CirclePlus,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      hoverBg: "hover:bg-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      status: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100",
      iconBg: "bg-emerald-500",
    },
    {
      status: "shipped",
      label: "Shipped",
      icon: Truck,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      hoverBg: "hover:bg-amber-100",
      iconBg: "bg-amber-500",
    },
    {
      status: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      hoverBg: "hover:bg-rose-100",
      iconBg: "bg-rose-500",
    },
    {
      status: "returned",
      label: "Returned",
      icon: RotateCcw,
      color: "text-violet-500",
      bgColor: "bg-violet-50",
      hoverBg: "hover:bg-violet-100",
      iconBg: "bg-violet-500",
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
            className={`
              relative overflow-hidden cursor-pointer transition-all duration-300
              ${config.bgColor} border-none shadow-lg
              ${config.hoverBg} hover:scale-105 hover:-translate-y-1
              ${isSelected ? 'ring-2 ring-offset-2 ' + config.color + ' scale-105 -translate-y-1' : ''}
            `}
            onClick={() => onStatusClick(config.status)}
          >
            <div className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className={`rounded-full p-3 ${config.iconBg} mb-3`}>
                  <config.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {config.label}
                </h3>
                <p className={`text-3xl font-bold ${config.color}`}>
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