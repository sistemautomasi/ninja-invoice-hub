import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { Cost } from "@/types/costs";

interface CostListProps {
  costs: Cost[] | undefined;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const CostList = ({ costs, onDelete, isDeleting }: CostListProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-4">
      {costs?.map((cost) => (
        <div
          key={cost.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{cost.cost_type}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(cost.date).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {cost.description}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">{formatPrice(cost.amount)}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(cost.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};