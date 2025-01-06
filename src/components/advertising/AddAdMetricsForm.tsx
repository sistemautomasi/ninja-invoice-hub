import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddAdMetricsFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const AddAdMetricsForm = ({ onSubmit, isLoading }: AddAdMetricsFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select name="platform" required>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign_name">Campaign Name</Label>
          <Input
            id="campaign_name"
            name="campaign_name"
            type="text"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ad_spend">Ad Spend</Label>
          <Input
            id="ad_spend"
            name="ad_spend"
            type="number"
            step="0.01"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="impressions">Impressions</Label>
          <Input
            id="impressions"
            name="impressions"
            type="number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clicks">Clicks</Label>
          <Input
            id="clicks"
            name="clicks"
            type="number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conversions">Conversions</Label>
          <Input
            id="conversions"
            name="conversions"
            type="number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue">Revenue</Label>
          <Input
            id="revenue"
            name="revenue"
            type="number"
            step="0.01"
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Metrics"}
      </Button>
    </form>
  );
};