import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

export interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isLogout?: boolean;
}

export const SidebarNavItem = ({ icon: Icon, label, href, isLogout }: SidebarNavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          isActive && "bg-muted"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
};