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
      // First, clear all local storage and cookies
      localStorage.clear();
      
      // Attempt to kill the session directly without checking status
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (e) {
        console.log("Local signout failed, continuing...");
      }

      // Clear any remaining auth state
      supabase.auth.clearSession();
      
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      // Ensure we still clear everything and redirect
      localStorage.clear();
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