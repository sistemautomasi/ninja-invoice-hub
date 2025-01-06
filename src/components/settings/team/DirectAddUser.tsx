import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";
import { UseMutationResult } from "@tanstack/react-query";

type UserRole = Database["public"]["Enums"]["user_role"];

interface DirectAddUserProps {
  addUser: UseMutationResult<any, Error, { email: string; role: UserRole }, unknown>;
}

export const DirectAddUser = ({ addUser }: DirectAddUserProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const role = formData.get('role') as UserRole;

    if (!email || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addUser.mutate({ email, role });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Add User Directly</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            required
            className="flex-1"
          />
          <Select name="role" defaultValue="staff">
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={addUser.isPending}>
          {addUser.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Add User
        </Button>
      </form>
    </div>
  );
};