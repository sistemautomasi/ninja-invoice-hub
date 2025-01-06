import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddCostFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const AddCostForm = ({ onSubmit, isLoading }: AddCostFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Cost Type</Label>
          <select
            id="type"
            name="type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            required
          >
            <option value="advertising">Advertising</option>
            <option value="shipping">Shipping</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            type="text"
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        Add Cost
      </Button>
    </form>
  );
};