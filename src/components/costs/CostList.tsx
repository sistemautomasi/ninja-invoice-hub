import { Button } from "@/components/ui/button";
import { X, Loader2, Pencil } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { Cost } from "@/types/costs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CostListProps {
  costs: Cost[] | undefined;
  onDelete: (id: string) => void;
  onEdit: (cost: Cost) => void;
  isDeleting: boolean;
}

export const CostList = ({ costs, onDelete, onEdit, isDeleting }: CostListProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {costs?.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell>{new Date(cost.date).toLocaleDateString()}</TableCell>
              <TableCell className="capitalize">{cost.cost_type.replace('_', ' ')}</TableCell>
              <TableCell className="text-muted-foreground">
                {cost.description}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatPrice(cost.amount)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(cost)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};