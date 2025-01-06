import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Cost } from "@/types/costs";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCostFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  editingCost?: Cost;
}

export const AddCostForm = ({ onSubmit, isLoading, editingCost }: AddCostFormProps) => {
  useEffect(() => {
    if (editingCost) {
      const form = document.getElementById('costForm') as HTMLFormElement;
      if (form) {
        form.type.value = editingCost.cost_type;
        form.platform.value = editingCost.platform || '';
        form.amount.value = editingCost.amount.toString();
        form.date.value = editingCost.date;
        form.description.value = editingCost.description || '';
      }
    }
  }, [editingCost]);

  return (
    <form id="costForm" onSubmit={onSubmit} className="space-y-4">
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
            <option value="shipping_cod">Shipping (Cash on Delivery)</option>
            <option value="shipping_online">Shipping (Online Banking)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <select
            id="platform"
            name="platform"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Select Platform</option>
            <option value="facebook">Facebook Ads</option>
            <option value="tiktok">TikTok Ads</option>
            <option value="google">Google Ads</option>
            <option value="instagram">Instagram Ads</option>
            <option value="others">Others</option>
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
            placeholder="Optional notes about this cost"
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {editingCost ? 'Update Cost' : 'Add Cost'}
      </Button>
    </form>
  );
};