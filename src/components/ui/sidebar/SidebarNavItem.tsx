import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isCollapsed: boolean;
  isLogout?: boolean;
}

export const SidebarNavItem = ({
  icon: Icon,
  label,
  href,
  isCollapsed,
  isLogout = false,
}: SidebarNavItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === href;

  const handleLogout = async () => {
    try {
      // First try to get the session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        // If there's no session, just redirect to signin
        navigate("/signin");
        return;
      }

      if (!session) {
        // No active session, just redirect
        navigate("/signin");
        return;
      }

      // Try to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during logout:", error);
        // Even if there's an error, we'll redirect to signin
        navigate("/signin");
        return;
      }

      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      // Ensure we redirect to signin even if there's an error
      navigate("/signin");
    }
  };

  if (isLogout) {
    return (
      <button
        onClick={handleLogout}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        {!isCollapsed && <span>{label}</span>}
      </button>
    );
  }

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};