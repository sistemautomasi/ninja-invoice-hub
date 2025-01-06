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

interface SendInviteFormProps {
  sendInvite: UseMutationResult<any, Error, { email: string; role: UserRole }, unknown>;
}

export const SendInviteForm = ({ sendInvite }: SendInviteFormProps) => {
  const { toast } = useToast();

  const handleInviteSubmit = (e: React.FormEvent) => {
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

    // For testing, only allow sending to the specified email
    if (email !== 'sistemautomasi2@gmail.com') {
      toast({
        title: "Testing Mode",
        description: "Currently, invites can only be sent to sistemautomasi2@gmail.com for testing purposes.",
        variant: "destructive",
      });
      return;
    }

    sendInvite.mutate({ email, role });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Send Team Invite</h3>
      <form onSubmit={handleInviteSubmit} className="space-y-4">
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
        <Button type="submit" disabled={sendInvite.isPending}>
          {sendInvite.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Send Invite
        </Button>
      </form>
    </div>
  );
};