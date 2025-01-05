import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MALAYSIAN_STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan",
  "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah",
  "Sarawak", "Selangor", "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur",
  "Wilayah Persekutuan Labuan",
  "Wilayah Persekutuan Putrajaya"
];

export const CustomerInfoFields = () => {
  return (
    <>
      <div className="space-y-2 text-left">
        <Label htmlFor="customerName">Customer Name *</Label>
        <Input id="customerName" name="customerName" required />
      </div>
      
      <div className="space-y-2 text-left">
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="phone">Phone *</Label>
        <Input id="phone" name="phone" required />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="address">Address *</Label>
        <Input id="address" name="address" required />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="district">District *</Label>
        <Input id="district" name="district" required />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="state">State *</Label>
        <select
          id="state"
          name="state"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Select a state</option>
          {MALAYSIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="postcode">Postcode *</Label>
        <Input id="postcode" name="postcode" required />
      </div>
    </>
  );
};